// src/services/workflowExecutor.js
import emailjs from "@emailjs/browser";
import { getWorkflows } from "./firestoreService";

// EVENT -> WORKFLOW MATCHING

const EVENT_KEYWORDS = {
  cancelled: ["cancel", "cancellation", "cancelled"],
  reminder: ["remind", "reminder"],
  completed: ["thank", "thankyou", "thanks", "complete"],
};

const DEFAULT_MESSAGES = {
  cancelled: (name) => `The meeting "${name}" has been cancelled. We hope to see you at a future event!`,
  reminder: (name) => `Looking forward to seeing you at "${name}" tomorrow!`,
  completed: (name) => `Thank you for attending "${name}"! We hope you enjoyed it.`,
};

//  SINGLE SOURCE OF TRUTH for sent emails
const SENT_EMAILS_KEY = "workflow_sent_emails_v2";

const getSentEmails = () => {
    try {
        return JSON.parse(localStorage.getItem(SENT_EMAILS_KEY) || "{}");
    } catch {
        return {};
    }
};

const saveSentEmails = (sent) => {
    localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(sent));
};

const isEmailAlreadySent = (meetingId, eventType) => {
    const sent = getSentEmails();
    const key = `${meetingId}_${eventType}`;
    const status = !!sent[key];
    if (status) {
        console.log(` [${eventType}] Already sent for ${meetingId} at ${sent[key]}`);
    }
    return status;
};

const markEmailSent = (meetingId, eventType) => {
    const sent = getSentEmails();
    const key = `${meetingId}_${eventType}`;
    sent[key] = new Date().toISOString();
    saveSentEmails(sent);
    console.log(` [${eventType}] Marked as sent for ${meetingId}`);
};

export const clearSentStatus = (meetingId) => {
    const sent = getSentEmails();
    Object.keys(sent).forEach(key => {
        if (key.startsWith(meetingId)) {
            delete sent[key];
        }
    });
    saveSentEmails(sent);
    console.log(` Cleared sent status for ${meetingId}`);
};

const getWorkflowsForEvent = (workflows, eventType) => {
    const keywords = EVENT_KEYWORDS[eventType] || [];
    if (keywords.length === 0) {
        console.log(`[${eventType}] No keywords found`);
        return [];
    }

    console.log(`[${eventType}] Searching for keywords:`, keywords);

    const matched = workflows.filter((workflow) => {
        if (!workflow.actions || workflow.actions.length === 0) return false;
        if (workflow.isActive === false) return false;

        const haystack = `${workflow.title || ""} ${workflow.category || ""} ${workflow.actions.map(a => a.label || "").join(" ")}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
    });

    console.log(`[${eventType}] Matching workflows:`, matched.length);
    return matched;
};

//  MAIN FUNCTION
export const executeWorkflowsForEvent = async (meetingData, eventType) => {
    try {
        if (!meetingData || !meetingData.id) {
            console.error(` No meeting ID for ${eventType}`);
            return 0;
        }

        if (isEmailAlreadySent(meetingData.id, eventType)) {
            console.log(` [${eventType}] Skipping - already sent for ${meetingData.id}`);
            return 0;
        }

        console.log(` [${eventType}] Starting workflow for ${meetingData.id}`);

        const workflows = await getWorkflows();
        const matchingWorkflows = getWorkflowsForEvent(workflows, eventType);

        if (matchingWorkflows.length === 0) {
            console.log(`[${eventType}] No matching workflows`);
            return 0;
        }

        for (const workflow of matchingWorkflows) {
            await executeWorkflow(workflow, meetingData, eventType);
        }

        markEmailSent(meetingData.id, eventType);
        console.log(` [${eventType}] Completed for ${meetingData.id}`);

        return matchingWorkflows.length;
    } catch (error) {
        console.error(`[${eventType}] Error:`, error);
        return 0;
    }
};

// Convenience wrappers
export const executeCancellationWorkflows = (meetingData) => {
    console.log(` Cancellation requested for ${meetingData?.id}`);
    return executeWorkflowsForEvent(meetingData, "cancelled");
};

export const executeReminderWorkflows = (meetingData) => {
    console.log(` Reminder requested for ${meetingData?.id}`);
    return executeWorkflowsForEvent(meetingData, "reminder");
};

export const executeThankYouWorkflows = (meetingData) => {
    console.log(` Thank You requested for ${meetingData?.id}`);
    return executeWorkflowsForEvent(meetingData, "completed");
};

export const executeWorkflow = async (workflow, eventData, eventType) => {
    console.log(`▶️ Executing workflow: ${workflow.title} [${eventType}]`);

    const results = [];
    for (const action of workflow.actions) {
        try {
            const result = await executeAction(action, eventData, eventType);
            results.push({ action, success: true, result });
            console.log(` Action executed: ${action.label}`);
        } catch (error) {
            console.error(` Action failed: ${action.label}`, error);
            results.push({ action, success: false, error: error.message });
        }
    }
    return results;
};

//  SEND EMAIL ACTION - Account 1 + Account 2 Support
const executeAction = async (action, eventData, eventType) => {
    switch (action.type) {
        case "email":
            return await executeEmailAction(action, eventData, eventType);
        case "notification":
            return await executeNotificationAction(action, eventData);
        case "sms":
            return await executeSmsAction(action, eventData);
        case "webhook":
            return await executeWebhookAction(action, eventData);
        case "calendar":
            return await executeCalendarAction(action, eventData);
        case "task":
            return await executeTaskAction(action, eventData);
        case "message":
            return await executeMessageAction(action, eventData);
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

//  SEND EMAIL ACTION - COMPLETE (All 4 Templates)
const executeEmailAction = async (action, eventData, eventType) => {
    console.log(` Sending ${eventType} email...`);

    let invitees = eventData.invitees || [];
    
    if (invitees.length === 0) {
        console.warn(`⚠️ No invitees found for ${eventType}`);
        const userStr = localStorage.getItem("currentUser");
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.email) {
            invitees = [{
                name: user.email.split('@')[0] || "Guest",
                email: user.email
            }];
            console.log(` Using current user as fallback: ${user.email}`);
        } else {
            throw new Error("No invitees and no current user found");
        }
    }

    const meetingName = eventData.meetingName || eventData.title || "Meeting";
    const organizerName = eventData.organizerName || "Organizer";
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;

    //  Build subject
    let emailSubject = action.config?.subject || "";
    if (!emailSubject) {
        switch (eventType) {
            case "cancelled":
                emailSubject = ` Cancelled: ${meetingName}`;
                break;
            case "reminder":
                emailSubject = ` Reminder: ${meetingName}`;
                break;
            case "completed":
                emailSubject = `🙏 Thank You: ${meetingName}`;
                break;
            default:
                emailSubject = `Update: ${meetingName}`;
        }
    }

    //  Build custom message
    let customMessage = action.config?.message || "";
    if (!customMessage) {
        switch (eventType) {
            case "cancelled":
                customMessage = "We apologize for any inconvenience caused.";
                break;
            case "reminder":
                customMessage = "Looking forward to seeing you!";
                break;
            case "completed":
                customMessage = "We hope you enjoyed the meeting!";
                break;
            default:
                customMessage = "You have an update on this meeting.";
        }
    }

    //  ACCOUNT SELECTION BASED ON EVENT TYPE
    let serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;      // Account 1 (Default)
    let publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;      // Account 1 (Default)
    let templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;    // Account 1 (Default)

    // 🔍 DEBUG: Check all env values first
    console.log(' ===== ENVIRONMENT VARIABLES CHECK =====');
    console.log(' ACCOUNT 1:');
    console.log('  Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
    console.log('  Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    console.log('  Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
    console.log('  Cancel Template:', import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE_ID);
    console.log(' ACCOUNT 2:');
    console.log('  Service ID:', import.meta.env.VITE_EMAILJS_REMINDER_SERVICE_ID);
    console.log('  Public Key:', import.meta.env.VITE_EMAILJS_REMINDER_PUBLIC_KEY);
    console.log('  Reminder Template:', import.meta.env.VITE_EMAILJS_REMINDER_TEMPLATE_ID);
    console.log('  Thank You Template:', import.meta.env.VITE_EMAILJS_THANKYOU_TEMPLATE_ID);
    console.log(' ========================================');

    switch (eventType) {
        case "cancelled":
            //  Account 1 - Cancellation
            serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            templateId = import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE_ID;
            console.log(` Using Account 1 for Cancellation`);
            break;

        case "reminder":
            //  Account 2 - Reminder
            serviceId = import.meta.env.VITE_EMAILJS_REMINDER_SERVICE_ID;
            publicKey = import.meta.env.VITE_EMAILJS_REMINDER_PUBLIC_KEY;
            templateId = import.meta.env.VITE_EMAILJS_REMINDER_TEMPLATE_ID;
            console.log(` Using Account 2 for Reminder`);
            break;

        case "completed":
            //  Account 2 - Thank You
            serviceId = import.meta.env.VITE_EMAILJS_REMINDER_SERVICE_ID;  // Same as Account 2
            publicKey = import.meta.env.VITE_EMAILJS_REMINDER_PUBLIC_KEY;  // Same as Account 2
            templateId = import.meta.env.VITE_EMAILJS_THANKYOU_TEMPLATE_ID;
            console.log(`Using Account 2 for Thank You`);
            break;

        default:
            //  Account 1 - Invite (default)
            serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            console.log(` Using Account 1 for Invite`);
    }

    //  Check if any value is undefined
    const missingValues = [];
    if (!serviceId) missingValues.push('Service ID');
    if (!publicKey) missingValues.push('Public Key');
    if (!templateId) missingValues.push('Template ID');

    if (missingValues.length > 0) {
        console.error(` MISSING EMAILJS VALUES for ${eventType}:`, missingValues.join(', '));
        console.error(' Please check your .env file!');
        console.error(' Required values:');
        console.error(`   - VITE_EMAILJS_REMINDER_SERVICE_ID (for reminder/thankyou)`);
        console.error(`   - VITE_EMAILJS_REMINDER_PUBLIC_KEY (for reminder/thankyou)`);
        console.error(`   - VITE_EMAILJS_REMINDER_TEMPLATE_ID (for reminder)`);
        console.error(`   - VITE_EMAILJS_THANKYOU_TEMPLATE_ID (for thankyou)`);
        throw new Error(`Missing EmailJS credentials for ${eventType}: ${missingValues.join(', ')}`);
    }

    console.log(`Service ID: ${serviceId}`);
    console.log(` Template ID: ${templateId}`);
    console.log(` Sending to ${invitees.length} recipients`);

    //  Send to each invitee
    const emailPromises = invitees.map(async (invitee, index) => {
        try {
            const templateParams = {
                to_name: invitee.name || "Guest",
                to_email: invitee.email,
                meeting_name: meetingName,
                meeting_date: eventData.date || new Date().toISOString().split('T')[0],
                start_time: eventData.startTime || "10:00",
                end_time: eventData.endTime || "11:00",
                meeting_location: eventData.location || "Online",
                online_link: eventData.onlineLink || "https://meet.google.com/",
                organizer_name: user?.email?.split('@')[0] || organizerName,
                organizer_email: user?.email || "organizer@example.com",
                custom_message: customMessage,
                email_subject: emailSubject,
            };

            if (eventType === "cancelled") {
                templateParams.cancellation_reason = action.config?.reason || "Meeting cancelled by organizer";
                templateParams.cancellation_message = "We apologize for any inconvenience caused.";
            }

            console.log(` [${index+1}/${invitees.length}] Sending ${eventType} to ${invitee.email}`);

            const response = await emailjs.send(
                serviceId,     
                templateId,   
                templateParams,
                publicKey      
            );

            console.log(` [${index+1}/${invitees.length}] ${eventType} sent to ${invitee.email}`);
            return response;
        } catch (error) {
            console.error(`Failed to send ${eventType} to ${invitee.email}:`, error);
            throw error;
        }
    });

    await Promise.all(emailPromises);
    console.log(` All ${invitees.length} ${eventType} emails sent`);
    return { sent: invitees.length, eventType, subject: emailSubject };
};

// OTHER ACTIONS (unchanged)

const executeNotificationAction = async (action, eventData) => {
    console.log(" Notification:", action.label);
    const title = action.config?.title || "Meeting Reminder";
    const message = `Meeting "${eventData.meetingName || eventData.title}" is starting soon!`;

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: "/calendar-icon.png"
        });
    }

    alert("Notification: " + title + "\n" + message);
    return { title, message };
};

const executeSmsAction = async (action, eventData) => {
    console.log(" SMS:", action.label);
    const message = `Meeting Reminder: ${eventData.meetingName || eventData.title} at ${eventData.startTime}`;
    alert("SMS Sent:\n" + message);
    return { sent: true };
};

const executeWebhookAction = async (action, eventData) => {
    console.log(" Webhook:", action.label);
    const webhookUrl = action.config?.url;
    if (!webhookUrl) {
        throw new Error("Webhook URL is required");
    }

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            event: "meeting_created",
            data: eventData,
            timestamp: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error("Webhook failed: " + response.status);
    }

    return { webhookUrl, status: response.status };
};

const executeCalendarAction = async (action, eventData) => {
    console.log(" Calendar:", action.label);
    const startTime = new Date(eventData.date + "T" + eventData.startTime);
    const endTime = new Date(eventData.date + "T" + eventData.endTime);

    const googleCalendarUrl =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(eventData.meetingName || eventData.title || "Meeting") +
        "&dates=" + startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z/" +
        endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z" +
        "&details=" + encodeURIComponent(eventData.description || "Meeting") +
        "&location=" + encodeURIComponent(eventData.location || "");

    window.open(googleCalendarUrl, "_blank");
    return { calendarUrl: googleCalendarUrl };
};

const executeTaskAction = async (action, eventData) => {
    console.log(" Task:", action.label);
    const taskTitle = action.config?.title || "Follow-up: " + (eventData.meetingName || eventData.title);
    alert("Task Created:\n" + taskTitle);
    return { taskTitle };
};

const executeMessageAction = async (action, eventData) => {
    console.log(" Message:", action.label);
    const message =
        "Meeting: " + (eventData.meetingName || eventData.title) + "\n" +
        "Date: " + eventData.date + "\n" +
        "Time: " + eventData.startTime + " - " + eventData.endTime + "\n" +
        "Location: " + (eventData.location || "Online");

    alert("Message Sent:\n" + message);
    return { message };
};

export default {
    executeWorkflowsForEvent,
    executeCancellationWorkflows,
    executeReminderWorkflows,
    executeThankYouWorkflows,
    executeWorkflow,
    clearSentStatus,
};