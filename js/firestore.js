import { db, auth } from './firebase.js';
import { 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ===== PRODUCTS =====

// Create product
export async function createProduct(productData) {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            views: 0,
            likes: 0
        });
        console.log("Product created with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating product: ", error);
        throw error;
    }
}

// Get all products
export async function getAllProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Error getting products: ", error);
        throw error;
    }
}

// Get products by seller
export async function getProductsBySeller(sellerId) {
    try {
        const q = query(
            collection(db, "products"), 
            where("sellerId", "==", sellerId)
        );
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Error getting seller products: ", error);
        throw error;
    }
}

// Update product
export async function updateProduct(productId, productData) {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: serverTimestamp()
        });
        console.log("Product updated");
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
}

// Delete product
export async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "products", productId));
        console.log("Product deleted");
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
}

// ===== WISHLIST =====

// Add to wishlist
export async function addToWishlist(userId, productId) {
    try {
        const docRef = await addDoc(collection(db, "wishlist"), {
            userId: userId,
            productId: productId,
            addedAt: serverTimestamp()
        });
        console.log("Added to wishlist");
        return docRef.id;
    } catch (error) {
        console.error("Error adding to wishlist: ", error);
        throw error;
    }
}

// Get user's wishlist
export async function getUserWishlist(userId) {
    try {
        const q = query(
            collection(db, "wishlist"), 
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const wishlist = [];
        querySnapshot.forEach((doc) => {
            wishlist.push({ id: doc.id, ...doc.data() });
        });
        return wishlist;
    } catch (error) {
        console.error("Error getting wishlist: ", error);
        throw error;
    }
}

// Remove from wishlist
export async function removeFromWishlist(wishlistId) {
    try {
        await deleteDoc(doc(db, "wishlist", wishlistId));
        console.log("Removed from wishlist");
    } catch (error) {
        console.error("Error removing from wishlist: ", error);
        throw error;
    }
}

// ===== CHATS =====

// Create or get chat
export async function createOrGetChat(buyerId, sellerId, productId) {
    try {
        // Check if chat exists
        const q = query(
            collection(db, "chats"),
            where("participants", "==", [buyerId, sellerId]),
            where("productId", "==", productId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // Return existing chat
            return querySnapshot.docs[0].id;
        }
        
        // Create new chat
        const chatData = {
            participants: [buyerId, sellerId],
            buyerId: buyerId,
            sellerId: sellerId,
            productId: productId,
            lastMessage: "",
            lastMessageTime: serverTimestamp(),
            unreadCount: {
                [buyerId]: 0,
                [sellerId]: 0
            },
            createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "chats"), chatData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating chat: ", error);
        throw error;
    }
}

// Send message
export async function sendMessage(chatId, senderId, text) {
    try {
        // Add message to subcollection
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
            senderId: senderId,
            text: text,
            timestamp: serverTimestamp(),
            read: false
        });
        
        // Update chat's last message
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp()
        });
        
        console.log("Message sent");
    } catch (error) {
        console.error("Error sending message: ", error);
        throw error;
    }
}

// Get chat messages
export async function getChatMessages(chatId) {
    try {
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        return messages;
    } catch (error) {
        console.error("Error getting messages: ", error);
        throw error;
    }
}

// Get user's chats
export async function getUserChats(userId) {
    try {
        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", userId),
            orderBy("lastMessageTime", "desc")
        );
        const querySnapshot = await getDocs(q);
        const chats = [];
        querySnapshot.forEach((doc) => {
            chats.push({ id: doc.id, ...doc.data() });
        });
        return chats;
    } catch (error) {
        console.error("Error getting chats: ", error);
        throw error;
    }
}

// ===== REVIEWS =====

// Create review
export async function createReview(reviewData) {
    try {
        const docRef = await addDoc(collection(db, "reviews"), {
            ...reviewData,
            createdAt: serverTimestamp()
        });
        console.log("Review created");
        return docRef.id;
    } catch (error) {
        console.error("Error creating review: ", error);
        throw error;
    }
}

// Get product reviews
export async function getProductReviews(productId) {
    try {
        const q = query(
            collection(db, "reviews"),
            where("productId", "==", productId)
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.error("Error getting reviews: ", error);
        throw error;
    }
}

// ===== CATEGORIES =====

// Get all categories
export async function getAllCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
    } catch (error) {
        console.error("Error getting categories: ", error);
        throw error;
    }
}