import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import Payment from "../models/Payment.js";

// GET current user details
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET analytics data for dashboard
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions
    const transactions = await Transaction.find({ createdBy: userId });

    // Calculate totals
    let totalLent = 0;
    let totalBorrowed = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    transactions.forEach((tx) => {
      if (tx.type === "LENT") {
        totalLent += tx.totalAmount || 0;
        totalPaid += tx.paidAmount || 0;
        totalOutstanding += (tx.totalAmount || 0) - (tx.paidAmount || 0);
      } else if (tx.type === "BORROWED") {
        totalBorrowed += tx.totalAmount || 0;
      }
    });

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find({ createdBy: userId })
      .populate("account", "customerName accountNumber")
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate available amount (what you lent - what you borrowed)
    const availableAmount = totalLent - totalBorrowed;

    // Get account count
    const accountCount = await Account.countDocuments({ createdBy: userId });

    // Portfolio distribution for pie chart
    const portfolio = [
      { name: "Lent", value: totalLent, fill: "#4F46E5" },
      { name: "Borrowed", value: totalBorrowed, fill: "#EF4444" },
    ];

    // Monthly interest data for chart (last 6 months)
    const monthlyInterest = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const monthTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.createdAt);
        return txDate >= monthStart && txDate <= monthEnd;
      });

      const interest = monthTransactions.reduce((sum, tx) => {
        return sum + ((tx.totalAmount || 0) - (tx.principal || 0));
      }, 0);

      monthlyInterest.push({
        month: months[monthDate.getMonth()],
        interest: Math.round(interest),
      });
    }

    res.json({
      totalLent,
      totalBorrowed,
      totalPaid,
      totalOutstanding,
      availableAmount,
      totalRedeem: totalPaid,
      accountCount,
      recentTransactions,
      transactionCount: transactions.length,
      portfolio,
      monthlyInterest,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET notifications (due payments, reminders)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get overdue transactions
    const overdueTransactions = await Transaction.find({
      createdBy: userId,
      dueDate: { $lt: today },
      status: { $ne: "COMPLETED" },
    })
      .populate("account", "customerName")
      .sort({ dueDate: 1 })
      .limit(10);

    // Get upcoming due transactions (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTransactions = await Transaction.find({
      createdBy: userId,
      dueDate: { $gte: today, $lte: nextWeek },
      status: { $ne: "COMPLETED" },
    })
      .populate("account", "customerName")
      .sort({ dueDate: 1 })
      .limit(10);

    // Get recent payments
    const recentPayments = await Payment.find()
      .populate({
        path: "transaction",
        match: { createdBy: userId },
        populate: { path: "account", select: "customerName" },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Filter out payments where transaction is null (not belonging to user)
    const filteredPayments = recentPayments.filter(
      (p) => p.transaction !== null
    );

    res.json({
      overdue: overdueTransactions.map((tx) => ({
        _id: tx._id,
        customerName: tx.account?.customerName || "Unknown",
        amount: tx.totalAmount - tx.paidAmount,
        dueDate: tx.dueDate,
        daysOverdue: Math.floor(
          (today - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24)
        ),
      })),
      upcoming: upcomingTransactions.map((tx) => ({
        _id: tx._id,
        customerName: tx.account?.customerName || "Unknown",
        amount: tx.totalAmount - tx.paidAmount,
        dueDate: tx.dueDate,
        daysUntilDue: Math.floor(
          (new Date(tx.dueDate) - today) / (1000 * 60 * 60 * 24)
        ),
      })),
      recentPayments: filteredPayments.map((p) => ({
        _id: p._id,
        customerName: p.transaction?.account?.customerName || "Unknown",
        amount: p.amount,
        date: p.createdAt,
        method: p.method,
      })),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message });
  }
};
