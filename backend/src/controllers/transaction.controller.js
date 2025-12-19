import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
} from "../utils/interest.js";

// CREATE transaction
export const createTransaction = async (req, res) => {
  try {
    const {
      accountId,
      type,
      amount,
      interestRate,
      durationMonths,
      interestType,
      paymentFrequency,
      date,
      dueDate,
      paymentMode,
      contact,
      notes,
      documents,
    } = req.body;

    if (!accountId || !amount || !interestRate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure account belongs to user
    const account = await Account.findOne({
      _id: accountId,
      createdBy: req.user.id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Calculate interest based on type and frequency
    const months = durationMonths || 12;
    let total;

    if (interestType === "Compound") {
      const result = calculateCompoundInterest(
        amount,
        interestRate,
        months,
        paymentFrequency
      );
      total = result.total;
    } else {
      const result = calculateSimpleInterest(
        amount,
        interestRate,
        months,
        paymentFrequency
      );
      total = result.total;
    }

    const transaction = await Transaction.create({
      account: accountId,
      type: type || "LENT",
      principal: amount,
      interestRate,
      durationMonths: months,
      interestType: interestType || "Simple",
      paymentFrequency: paymentFrequency || "Monthly",
      totalAmount: total,
      paidAmount: 0,
      status: "ACTIVE",
      date: date || new Date(),
      dueDate,
      paymentMode,
      contact,
      notes,
      documents: documents || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Import Payment model
    const Payment = mongoose.model("Payment");

    // Manually populate account and calculate status for each transaction
    const populatedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        try {
          // Populate account
          const account = await Account.findById(tx.account);

          // Calculate total payments made
          const payments = await Payment.find({ transaction: tx._id });
          const totalPaid = payments.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
          );

          // Determine status based on stored status or calculate
          let status = tx.status || "ACTIVE";

          // Override with calculated status if needed
          const today = new Date();
          const dueDate = tx.dueDate ? new Date(tx.dueDate) : null;

          if (totalPaid >= tx.totalAmount) {
            status = "COMPLETED";
          } else if (totalPaid > 0) {
            status = "PARTIAL";
          } else if (dueDate && today > dueDate) {
            status = "OVERDUE";
          }

          return {
            ...tx,
            account,
            status,
            paidAmount: totalPaid,
          };
        } catch (error) {
          console.error(`Error processing transaction ${tx._id}:`, error);
          return tx;
        }
      })
    );

    res.json(populatedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("account", "customerName email phone accountType");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Calculate actual paid amount from payments
    const Payment = mongoose.model("Payment");
    const payments = await Payment.find({ transaction: transaction._id });
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    console.log("Transaction ID:", transaction._id);
    console.log("Payments found:", payments.length);
    console.log("Total paid:", totalPaid);
    console.log("Transaction paidAmount field:", transaction.paidAmount);

    // Calculate status dynamically
    const today = new Date();
    const dueDate = transaction.dueDate ? new Date(transaction.dueDate) : null;

    let status = "ACTIVE";
    if (totalPaid >= transaction.totalAmount) {
      status = "COMPLETED";
    } else if (totalPaid > 0) {
      status = "PARTIAL";
    } else if (dueDate && today > dueDate) {
      status = "OVERDUE";
    }

    console.log("Calculated status:", status);

    // Return transaction with calculated values
    const transactionObj = transaction.toObject();
    transactionObj.paidAmount = totalPaid;
    transactionObj.status = status;

    res.json(transactionObj);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET transactions by account
export const getTransactionsByAccount = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      account: req.params.accountId,
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE transaction status
export const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction status updated",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE transaction (optional)
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
