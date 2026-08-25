// src/services/authService.js
import { auth, db } from "../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// ✅ Set persistence (user stays logged in)
export const setAuthPersistence = () => {
    return setPersistence(auth, browserLocalPersistence);
};

// ✅ Sign Up with Firebase
export const signUp = async (email, password, displayName) => {
    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update profile with display name
        await updateProfile(user, {
            displayName: displayName
        });

        // 3. Save user data to Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            photoURL: user.photoURL || null,
        });

        console.log("✅ User created:", user.uid);
        return user;
    } catch (error) {
        console.error("❌ Sign up error:", error);
        throw error;
    }
};

// ✅ Sign In with Firebase
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ User signed in:", userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Sign in error:", error);
        throw error;
    }
};

// ✅ Sign Out
export const logOut = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("currentUser");
        console.log("✅ User signed out");
    } catch (error) {
        console.error("❌ Sign out error:", error);
        throw error;
    }
};

// ✅ Get Current User (Sync)
export const getCurrentUser = () => {
    return auth.currentUser;
};

// ✅ Get Current User (Async with Firestore data)
export const getCurrentUserData = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { ...userSnap.data(), uid: user.uid };
        }
        return {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0] || "User",
        };
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return null;
    }
};

// ✅ Auth State Observer
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            const userData = await getCurrentUserData();
            callback(userData || user);
        } else {
            // User is signed out
            callback(null);
        }
    });
};

// ✅ Reset Password
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("✅ Password reset email sent to:", email);
    } catch (error) {
        console.error("❌ Reset password error:", error);
        throw error;
    }
};