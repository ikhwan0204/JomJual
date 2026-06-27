import { db } from './firebase.js';
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

const storage = getStorage();

// Upload product image
export async function uploadProductImage(productId, file) {
    try {
        const storageRef = ref(storage, `products/${productId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress monitoring
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    // Upload completed
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
    }
}

// Upload multiple images
export async function uploadMultipleImages(productId, files) {
    const uploadPromises = [];
    
    for (let i = 0; i < files.length; i++) {
        if (i >= 5) break; // Max 5 images
        uploadPromises.push(uploadProductImage(productId, files[i]));
    }
    
    return Promise.all(uploadPromises);
}

// Delete image
export async function deleteImage(imageURL) {
    try {
        const imageRef = ref(storage, imageURL);
        await deleteObject(imageRef);
        console.log("Image deleted");
    } catch (error) {
        console.error("Error deleting image: ", error);
        throw error;
    }
}

// Upload profile picture
export async function uploadProfilePicture(userId, file) {
    try {
        const storageRef = ref(storage, `users/${userId}/profile.jpg`);
        await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile picture: ", error);
        throw error;
    }
}