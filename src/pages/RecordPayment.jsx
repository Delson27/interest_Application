import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTransactionById, recordPayment } from "../services/api";
import { useForm } from "react-hook-form";

export default function RecordPayment() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (token && id) {
      getTransactionById(id, token)
        .then((data) => {
          setTransaction(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token, id]);

  const paymentAmount = watch("amount");
  const remainingBalance = transaction
    ? transaction.totalAmount -
      (transaction.paidAmount || 0) -
      (Number(paymentAmount) || 0)
    : 0;

  const onSubmit = async (data) => {
    try {
      await recordPayment(id, data, token);
      alert("Payment recorded successfully!");
      navigate(`/transactions/${id}`);
    } catch (err) {
      alert("Failed to record payment: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!transaction) {
    return <div className="p-6">Transaction not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Record Payment</h1>

      {/* Transaction Details */}
      <div className="bg-white p-6 rounded-card shadow-card">
        <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Customer:</span>{" "}
            {transaction.account?.customerName || "N/A"}
          </p>
          <p>
            <span className="font-medium">Total Amount:</span> ₹
            {transaction.totalAmount?.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Paid Amount:</span> ₹
            {(transaction.paidAmount || 0)?.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Outstanding:</span> ₹
            {(
              transaction.totalAmount - (transaction.paidAmount || 0)
            )?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-card shadow-card space-y-4"
      >
        <h2 className="text-lg font-semibold">Payment Information</h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Payment Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full p-3 border rounded-lg"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" },
              max: {
                value: transaction.totalAmount - (transaction.paidAmount || 0),
                message: "Amount cannot exceed outstanding balance",
              },
            })}
          />
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Payment Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            {...register("date", { required: "Date is required" })}
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Payment Method
          </label>
          <select
            className="w-full p-3 border rounded-lg"
            {...register("method", { required: true })}
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="UPI">UPI</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows="3"
            {...register("notes")}
            placeholder="Add any notes about this payment..."
          />
        </div>

        {/* Preview */}
        {paymentAmount && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium">
              Remaining Balance After Payment:
            </p>
            <p className="text-2xl font-bold text-primary">
              ₹{remainingBalance.toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Recording..." : "Record Payment"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
