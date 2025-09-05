// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Select the form and the register link
    const loginForm = document.getElementById("loginForm");
    const registerLink = document.getElementById("registerLink");

    // 🔹 Login functionality
    // We listen for the 'submit' event on the form itself.
    // This is better practice as it also works when the user presses 'Enter'.
    loginForm.addEventListener("submit", (event) => {
        // Prevent the form from reloading the page
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Basic validation
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        // Sign in with Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // 🚨 SECURITY WARNING: This admin check is on the client-side and is not secure.
                // Anyone can view this code and navigate to "admin2.html" directly.
                // Proper admin checks should be done using backend logic (e.g., Firebase Custom Claims).
                if (user.email === "mathematicianlittle@gmail.com") {
                    window.location.href = "admin2.html"; // Redirect to admin page
                } else {
                    window.location.href = "user.html";   // Redirect to standard user page
                }
            })
            .catch((error) => {
                // Handle login errors
                alert("Login failed: " + error.message);
            });
    });

    // 🔹 Register functionality (when clicking the "Sign Up" link)
    registerLink.addEventListener("click", (event) => {
        // Prevent the link from navigating
        event.preventDefault();

        const email = prompt("Enter your email to register:");
        const password = prompt("Enter a password (min. 6 characters):");

        // Basic validation for prompts
        if (!email || !password) {
            alert("Email and password are required for registration.");
            return;
        }

        // Create a new user with Firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Registration successful! Welcome, " + user.email);
                // Optional: Automatically redirect to the user page after registration
                // window.location.href = "user.html";
            })
            .catch((error) => {
                // Handle registration errors
                alert("Registration failed: " + error.message);
            });
    });
});