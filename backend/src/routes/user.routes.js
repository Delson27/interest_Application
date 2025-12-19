import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getUser,
  getAnalytics,
  getNotifications,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getUser);
router.get("/analytics", getAnalytics);
router.get("/notifications", getNotifications);

export default router;
