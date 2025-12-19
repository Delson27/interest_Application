import express from "express";
import { uploadDocument } from "../controllers/upload.controller.js";
import { upload } from "../config/upload.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:transactionId", protect, upload.single("file"), uploadDocument);

export default router;
