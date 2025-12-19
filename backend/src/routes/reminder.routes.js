import express from "express";
import Transaction from "../models/Transaction.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get due payments (overdue transactions)
router.get("/due", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find transactions where dueDate is in the past and status is not COMPLETED
    const dueTransactions = await Transaction.find({
      createdBy: userId,
      dueDate: { $lt: today },
      status: { $nin: ["COMPLETED"] },
    })
      .populate("account", "customerName")
      .sort({ dueDate: 1 });

    // Calculate days overdue and outstanding amount for each
    const duePayments = await Promise.all(
      dueTransactions.map(async (transaction) => {
        const payments = await Payment.find({ transaction: transaction._id });
        const totalPaid = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const outstanding = transaction.totalAmount - totalPaid;

        const daysOverdue = Math.floor(
          (today - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24)
        );

        return {
          _id: transaction._id,
          customerName: transaction.account?.customerName || "Unknown",
          amount: transaction.totalAmount,
          outstanding,
          dueDate: transaction.dueDate,
          daysOverdue,
          type: transaction.type,
          interestRate: transaction.interestRate,
        };
      })
    );

    // Filter out transactions that are fully paid
    const overduePayments = duePayments.filter(
      (payment) => payment.outstanding > 0
    );

    res.json({
      success: true,
      data: overduePayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch due payments",
      error: error.message,
    });
  }
});

// Get upcoming payments (due within next 7 days)
router.get("/upcoming", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Find transactions due in the next 7 days
    const upcomingTransactions = await Transaction.find({
      createdBy: userId,
      dueDate: { $gte: today, $lte: sevenDaysFromNow },
      status: { $nin: ["COMPLETED"] },
    })
      .populate("account", "customerName")
      .sort({ dueDate: 1 });

    const upcomingPayments = await Promise.all(
      upcomingTransactions.map(async (transaction) => {
        const payments = await Payment.find({ transaction: transaction._id });
        const totalPaid = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const outstanding = transaction.totalAmount - totalPaid;

        const daysUntilDue = Math.floor(
          (new Date(transaction.dueDate) - today) / (1000 * 60 * 60 * 24)
        );

        return {
          _id: transaction._id,
          customerName: transaction.account?.customerName || "Unknown",
          amount: transaction.totalAmount,
          outstanding,
          dueDate: transaction.dueDate,
          daysUntilDue,
          type: transaction.type,
          interestRate: transaction.interestRate,
        };
      })
    );

    // Filter out transactions that are fully paid
    const filteredPayments = upcomingPayments.filter(
      (payment) => payment.outstanding > 0
    );

    res.json({
      success: true,
      data: filteredPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming payments",
      error: error.message,
    });
  }
});

// Send reminder for a specific payment
router.post("/:paymentId/send", protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { method, message } = req.body;
    const userId = req.user.id;

    // Verify transaction belongs to user
    const transaction = await Transaction.findOne({
      _id: paymentId,
      userId,
    }).populate("accountId", "customerName email phone");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Create notification record
    const notification = await Notification.create({
      userId,
      transactionId: transaction._id,
      message:
        message || `Payment reminder for ${transaction.accountId.customerName}`,
      type: "REMINDER",
      method,
      status: "SENT",
    });

    // In a real application, you would integrate with:
    // - Email service (SendGrid, AWS SES, etc.) for method === 'email'
    // - SMS service (Twilio, etc.) for method === 'sms'
    // - WhatsApp API for method === 'whatsapp'

    // Simulated success response
    res.json({
      success: true,
      message: `Reminder sent via ${method}`,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reminder",
      error: error.message,
    });
  }
});

export default router;
