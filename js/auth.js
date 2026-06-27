// js/auth.js
import { auth, db } from './firebase.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

// ===== REGISTER WITH EMAIL =====
export async function doRegister(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with name
        await updateProfile(user, { displayName: name });
        
        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            role: "user"
        });
        
        alert("Registration successful!");
        showPage('home');
        return user;
    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
        throw error;
    }
}

// ===== LOGIN WITH EMAIL =====
export async function doLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user.email);
        showPage('home');
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
        throw error;
    }
}

// ===== LOGIN WITH GOOGLE =====
export async function doGoogleLogin() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Save user to Firestore if new
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            role: "user"
        }, { merge: true });
        
        console.log("Google login successful:", user.email);
        showPage('home');
        return user;
    } catch (error) {
        console.error("Google login error:", error);
        alert("Google login failed: " + error.message);
        throw error;
    }
}

// ===== LOGOUT =====
export async function doLogout() {
    try {
        await signOut(auth);
        console.log("Logged out");
        showPage('login');
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// ===== CHECK AUTH STATE =====
export function checkAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            callback(user);
        } else {
            console.log("User is logged out");
            callback(null);
        }
    });
}

// Make functions available globally for HTML onclick
window.doLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await doLogin(email, password);
};

window.doRegister = async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    await doRegister(name, email, password);
};

window.doGoogleLogin = doGoogleLogin;
window.doLogout = doLogout;