// src/services/workflowExecutor.js
import emailjs from "@emailjs/browser";
import { getWorkflows } from "./firestoreService";


// Execute workflow when meeting is created
export const executeMatchingWorkflows = async (meetingData) => {
    try {
        // Get all workflows from Firebase
        const workflows = await getWorkflows();
        console.log("Found workflows:", workflows.length);

        // Find workflows that should run for this meeting
        const matchingWorkflows = workflows.filter(workflow => {
            // Check if workflow has actions
            if (!workflow.actions || workflow.actions.length === 0) return false;
            
            // Check if workflow is active
            if (workflow.isActive === false) return false;
            
            return true;
        });

        console.log("Matching workflows:", matchingWorkflows.length);

        // Execute each matching workflow
        for (const workflow of matchingWorkflows) {
            await executeWorkflow(workflow, meetingData);
        }

        return matchingWorkflows.length;
    } catch (error) {
        console.error("Error executing workflows:", error);
        return 0;
    }
};

// Execute a single workflow
export const executeWorkflow = async (workflow, eventData) => {
    console.log("Executing workflow:", workflow.title);
    console.log("Actions:", workflow.actions.length);

    const results = [];

    for (const action of workflow.actions) {
        try {
            const result = await executeAction(action, eventData);
            results.push({ action, success: true, result });
            console.log("Action executed:", action.label);
        } catch (error) {
            console.error("Action failed:", action.label, error);
            results.push({ action, success: false, error: error.message });
        }
    }

    return results;
};

// Execute single action based on type
const executeAction = async (action, eventData) => {
    switch (action.type) {
        case "email":
            return await executeEmailAction(action, eventData);
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
            throw new Error("Unknown action type: " + action.type);
    }
};

// 1. Send Email Action
const executeEmailAction = async (action, eventData) => {
    console.log("Sending email:", action.label);

    const invitees = eventData.invitees || [];
    const organizerEmail = eventData.organizerEmail || "organizer@example.com";
    const organizerName = eventData.organizerName || "Organizer";

    // Get current user for from name
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;

    // Send email to each invitee
    const emailPromises = invitees.map(async (invitee) => {
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    to_name: invitee.name || "Guest",
                    to_email: invitee.email,
                    meeting_name: eventData.meetingName || eventData.title || "Meeting",
                    meeting_date: eventData.date || new Date().toISOString().split('T')[0],
                    start_time: eventData.startTime || "10:00",
                    end_time: eventData.endTime || "11:00",
                    meeting_location: eventData.location || "Online",
                    online_link: eventData.onlineLink || "https://meet.google.com/",
                    organizer_name: user?.email?.split('@')[0] || organizerName,
                    organizer_email: organizerEmail,
                    custom_message: action.config?.subject || "You have been invited!"
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            console.log("Email sent to:", invitee.email);
        } catch (error) {
            console.error("Failed to send email to:", invitee.email, error);
            throw error;
        }
    });

    await Promise.all(emailPromises);
    return { sent: invitees.length };
};

// 2. Send Notification Action
const executeNotificationAction = async (action, eventData) => {
    console.log("Sending notification:", action.label);

    const title = action.config?.title || "Meeting Reminder";
    const message = `Meeting "${eventData.meetingName || eventData.title}" is starting soon!`;

    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: "/calendar-icon.png"
        });
    }

    // Alert for demo
    alert("Notification: " + title + "\n" + message);

    return { title, message };
};

// 3. Send SMS Action (Demo)
const executeSmsAction = async (action, eventData) => {
    console.log("Sending SMS:", action.label);

    const message = `Meeting Reminder: ${eventData.meetingName || eventData.title} at ${eventData.startTime}`;
    
    // Demo: Show alert
    alert("SMS Sent:\n" + message);

    return { sent: true };
};

// 4. Webhook Action
const executeWebhookAction = async (action, eventData) => {
    console.log("Calling webhook:", action.label);

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

// 5. Add to Calendar Action
const executeCalendarAction = async (action, eventData) => {
    console.log("Adding to calendar:", action.label);

    const startTime = new Date(eventData.date + "T" + eventData.startTime);
    const endTime = new Date(eventData.date + "T" + eventData.endTime);

    const googleCalendarUrl =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(eventData.meetingName || eventData.title || "Meeting") +
        "&dates=" + startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z/" +
        endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z" +
        "&details=" + encodeURIComponent(eventData.description || "Meeting") +
        "&location=" + encodeURIComponent(eventData.location || "");

    // Open in new tab
    window.open(googleCalendarUrl, "_blank");

    return { calendarUrl: googleCalendarUrl };
};

// 6. Create Task Action (Demo)
const executeTaskAction = async (action, eventData) => {
    console.log("Creating task:", action.label);

    const taskTitle = action.config?.title || "Follow-up: " + (eventData.meetingName || eventData.title);

    alert("Task Created:\n" + taskTitle);

    return { taskTitle };
};

// 7. Send Message Action (Demo)
const executeMessageAction = async (action, eventData) => {
    console.log("Sending message:", action.label);

    const message =
        "Meeting: " + (eventData.meetingName || eventData.title) + "\n" +
        "Date: " + eventData.date + "\n" +
        "Time: " + eventData.startTime + " - " + eventData.endTime + "\n" +
        "Location: " + (eventData.location || "Online");

    alert("Message Sent:\n" + message);

    return { message };
};