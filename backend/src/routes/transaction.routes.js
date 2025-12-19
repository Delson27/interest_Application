import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByAccount,
  updateTransactionStatus,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import {
  createPayment,
  getPaymentsByTransaction,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/account/:accountId", getTransactionsByAccount);
router.get("/:id", getTransactionById);
router.post("/:id/payments", createPayment);
router.get("/:id/payments", getPaymentsByTransaction);
router.put("/:id/status", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

export default router;
