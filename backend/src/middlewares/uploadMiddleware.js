import multer from "multer";

// Use memory storage to avoid direct streaming to Cloudinary during ingestion
// This makes the API more resilient to connection issues and allows manual control over the upload
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default upload;
