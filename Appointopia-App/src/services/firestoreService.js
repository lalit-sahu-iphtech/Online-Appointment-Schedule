// src/services/firestoreService.js
import { db } from "../firebase/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    setDoc
} from "firebase/firestore";

// ============================================
// COLLECTION NAMES
// ============================================

const COLLECTIONS = {
    MEETINGS: "meetings",
    APPOINTMENTS: "appointments",
    WORKFLOWS: "workflows",
    USERS: "users"
};

// ============================================
// ✅ SAVE DATA (CREATE)
// ============================================

// ✅ Add a meeting
export const addMeeting = async (meetingData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.MEETINGS), {
            ...meetingData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log("✅ Meeting added with ID:", docRef.id);
        return { id: docRef.id, ...meetingData };
    } catch (error) {
        console.error("❌ Error adding meeting:", error);
        throw error;
    }
};

// ✅ Add an appointment
export const addAppointment = async (appointmentData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
            ...appointmentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log("✅ Appointment added with ID:", docRef.id);
        return { id: docRef.id, ...appointmentData };
    } catch (error) {
        console.error("❌ Error adding appointment:", error);
        throw error;
    }
};

// ✅ Add a workflow
export const addWorkflow = async (workflowData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.WORKFLOWS), {
            ...workflowData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log("✅ Workflow added with ID:", docRef.id);
        return { id: docRef.id, ...workflowData };
    } catch (error) {
        console.error("❌ Error adding workflow:", error);
        throw error;
    }
};

// ============================================
// 📥 FETCH DATA (READ)
// ============================================

// ✅ Get all meetings
export const getMeetings = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.MEETINGS));
        const meetings = [];
        querySnapshot.forEach((doc) => {
            meetings.push({ id: doc.id, ...doc.data() });
        });
        console.log("📥 Meetings fetched:", meetings.length);
        return meetings;
    } catch (error) {
        console.error("❌ Error fetching meetings:", error);
        throw error;
    }
};

// ✅ Get meetings by user email
export const getMeetingsByUser = async (userEmail) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.MEETINGS),
            where("organizerEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const meetings = [];
        querySnapshot.forEach((doc) => {
            meetings.push({ id: doc.id, ...doc.data() });
        });
        console.log("📥 Meetings fetched for user:", meetings.length);
        return meetings;
    } catch (error) {
        console.error("❌ Error fetching meetings:", error);
        throw error;
    }
};

// ✅ Get all appointments
export const getAppointments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.APPOINTMENTS));
        const appointments = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        console.log("📥 Appointments fetched:", appointments.length);
        return appointments;
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        throw error;
    }
};

// ✅ Get appointments by user email
export const getAppointmentsByUser = async (userEmail) => {
    try {
        const q = query(
            collection(db, COLLECTIONS.APPOINTMENTS),
            where("organizerEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const appointments = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        console.log("📥 Appointments fetched for user:", appointments.length);
        return appointments;
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        throw error;
    }
};

// ✅ Get all workflows
export const getWorkflows = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.WORKFLOWS));
        const workflows = [];
        querySnapshot.forEach((doc) => {
            workflows.push({ id: doc.id, ...doc.data() });
        });
        console.log("📥 Workflows fetched:", workflows.length);
        return workflows;
    } catch (error) {
        console.error("❌ Error fetching workflows:", error);
        throw error;
    }
};

// ✅ Get single item by ID
export const getItemById = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("📥 Item found:", docSnap.id);
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("❌ No such document!");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching item:", error);
        throw error;
    }
};

// ============================================
// ✏️ UPDATE DATA (UPDATE)
// ============================================

// ✅ Update a meeting
export const updateMeeting = async (id, data) => {
    try {
        const docRef = doc(db, COLLECTIONS.MEETINGS, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log("✏️ Meeting updated:", id);
        return { id, ...data };
    } catch (error) {
        console.error("❌ Error updating meeting:", error);
        throw error;
    }
};

// ✅ Update an appointment
export const updateAppointment = async (id, data) => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log("✏️ Appointment updated:", id);
        return { id, ...data };
    } catch (error) {
        console.error("❌ Error updating appointment:", error);
        throw error;
    }
};

// ✅ Update a workflow
export const updateWorkflow = async (id, data) => {
    try {
        const docRef = doc(db, COLLECTIONS.WORKFLOWS, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log("✏️ Workflow updated:", id);
        return { id, ...data };
    } catch (error) {
        console.error("❌ Error updating workflow:", error);
        throw error;
    }
};

// ============================================
// 🗑️ DELETE DATA (DELETE)
// ============================================

// ✅ Delete a meeting
export const deleteMeeting = async (id) => {
    try {
        const docRef = doc(db, COLLECTIONS.MEETINGS, id);
        await deleteDoc(docRef);
        console.log("🗑️ Meeting deleted:", id);
        return id;
    } catch (error) {
        console.error("❌ Error deleting meeting:", error);
        throw error;
    }
};

// ✅ Delete an appointment
export const deleteAppointment = async (id) => {
    try {
        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);
        await deleteDoc(docRef);
        console.log("🗑️ Appointment deleted:", id);
        return id;
    } catch (error) {
        console.error("❌ Error deleting appointment:", error);
        throw error;
    }
};

// ✅ Delete a workflow
export const deleteWorkflow = async (id) => {
    try {
        const docRef = doc(db, COLLECTIONS.WORKFLOWS, id);
        await deleteDoc(docRef);
        console.log("🗑️ Workflow deleted:", id);
        return id;
    } catch (error) {
        console.error("❌ Error deleting workflow:", error);
        throw error;
    }
};

export { COLLECTIONS };