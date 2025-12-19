import Payment from "../models/Payment.js";
import Transaction from "../models/Transaction.js";

// CREATE payment
export const createPayment = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { amount, method, notes } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      createdBy: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Create payment
    const payment = await Payment.create({
      transaction: transactionId,
      amount,
      method,
      notes,
    });

    // Calculate total paid
    const payments = await Payment.find({ transaction: transactionId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    // Update transaction with total paid amount
    transaction.paidAmount = totalPaid;

    // Auto-update transaction status
    if (totalPaid >= transaction.totalAmount) {
      transaction.status = "COMPLETED";
    } else if (totalPaid > 0) {
      transaction.status = "PARTIAL";
    }

    await transaction.save();

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
      transactionStatus: transaction.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET payments for a transaction
export const getPaymentsByTransaction = async (req, res) => {
  try {
    const { id: transactionId } = req.params;

    const payments = await Payment.find({
      transaction: transactionId,
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
