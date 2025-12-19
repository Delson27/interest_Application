import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: ["LENT", "BORROWED"],
      required: true,
    },
    principal: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    interestType: {
      type: String,
      enum: ["Simple", "Compound"],
      default: "Simple",
    },
    paymentFrequency: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: "Monthly",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Bank Transfer", "UPI", "Cheque", "Online"],
    },
    contact: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    documents: [
      {
        filename: String,
        path: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "PARTIAL", "COMPLETED", "OVERDUE"],
      default: "ACTIVE",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
