// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQtd4Ap9S1XtFadwpRO7jR7I35nG7ZZM0",
    authDomain: "orignal-b7e9a.firebaseapp.com",
    projectId: "orignal-b7e9a",
    storageBucket: "orignal-b7e9a.firebasestorage.app",
    messagingSenderId: "450254224218",
    appId: "1:450254224218:web:ab5df2fd62a0910d435163",
    measurementId: "G-Q8DSCSDBZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set session persistence (THIS IS THE CORRECTED PLACEMENT)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        // Now that persistence is set, we can proceed with auth checks.
        initializeAuthObserver();
    })
    .catch((error) => {
        console.error("Error setting persistence: ", error);
    });

// DOM Elements
const form = document.getElementById("eventForm");
const statusMessage = document.getElementById("statusMessage");
const logoutBtn = document.getElementById("logoutBtn");
const eventDescriptionInput = document.getElementById("eventDescription");
const charCounter = document.getElementById("charCounter");

// --- Authentication Guard ---
function initializeAuthObserver() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            // 🚨 SECURITY WARNING: This client-side check is not secure.
            if (user.email !== "mathematicianlittle@gmail.com") {
                alert("Access Denied. You are not an administrator.");
                window.location.replace("index.html");
            }
        } else {
            // User is signed out.
            alert("You must be logged in to access this page.");
            window.location.replace("index.html");
        }
    });
}

// --- Logout ---
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("You have been logged out successfully.");
            window.location.replace("register.html");
        })
        .catch((error) => {
            console.error("Logout Error:", error);
            alert("Failed to log out. Please try again.");
        });
});

// --- Block back button after logout ---
window.addEventListener("pageshow", (event) => {
    const historyTraversal = event.persisted ||
        (typeof window.performance !== "undefined" &&
            window.performance.navigation.type === 2);
    if (historyTraversal && !auth.currentUser) {
        window.location.replace("index.html");
    }
});

// --- Form Submission ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
        alert("Authentication error. Please log in again.");
        return;
    }

    const eventData = {
        ltSelection: document.getElementById("ltSelect").value,
        eventName: document.getElementById("eventName").value.trim(),
        eventDate: document.getElementById("eventDate").value,
        eventTime: document.getElementById("eventTime").value,
        eventDescription: eventDescriptionInput.value.trim(),
        createdBy: auth.currentUser.email,
        createdAt: serverTimestamp(),
    };

    try {
        await addDoc(collection(db, "events"), eventData);

        statusMessage.textContent = "✅ Event saved successfully!";
        statusMessage.style.color = "green";
        statusMessage.style.display = "block";

        form.reset();
        charCounter.textContent = "0 characters";

        setTimeout(() => {
            statusMessage.style.display = "none";
        }, 3000);

    } catch (error) {
        console.error("Error saving event:", error);
        statusMessage.textContent = `❌ Failed: ${error.message}`;
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
    }
});

// --- Character Counter ---
eventDescriptionInput.addEventListener("input", () => {
    charCounter.textContent = `${eventDescriptionInput.value.length} characters`;
});