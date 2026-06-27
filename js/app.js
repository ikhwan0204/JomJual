// js/app.js
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// 1. YOUR EXISTING FIRESTORE TEST CODE
async function testConnection() {
    try {
        const querySnapshot = await getDocs(collection(db, "products")); 
        console.log("Berjaya berhubung dengan Firestore! Jumlah produk:", querySnapshot.size);
    } catch (error) {
        console.error("Gagal berhubung dengan Firestore:", error);
    }
}

testConnection();

// 2. NEW CODE: PAGE NAVIGATION (Add this below)
window.showPage = function(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the requested page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        window.scrollTo(0, 0);
    }
};

// Show home page when site loads
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});