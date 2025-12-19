import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidOn: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque", "Online"],
      default: "Cash",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
