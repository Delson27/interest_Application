import express from "express";
import {
  createPayment,
  getPaymentsByTransaction,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createPayment);
router.get("/:transactionId", getPaymentsByTransaction);

export default router;
