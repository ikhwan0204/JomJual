// js/products.js
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // Di sini anda akan masukkan kod untuk bina HTML produk anda
    });
}