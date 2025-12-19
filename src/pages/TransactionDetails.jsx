import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTransactionById, getPaymentHistory } from "../services/api";

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      Promise.all([getTransactionById(id, token), getPaymentHistory(id, token)])
        .then(([txData, paymentData]) => {
          setTransaction(txData);
          setPayments(paymentData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token, id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!transaction) {
    return <div className="p-6">Transaction not found</div>;
  }

  const outstanding = transaction.totalAmount - (transaction.paidAmount || 0);

  // Calculate status based on actual payments
  const getStatus = () => {
    const paid = transaction.paidAmount || 0;
    if (paid >= transaction.totalAmount) {
      return "Completed";
    } else if (paid > 0) {
      return "Partial";
    } else {
      return "Active";
    }
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transaction Details</h1>
        <button
          onClick={() => navigate(`/transactions/${id}/payment`)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Record Payment
        </button>
      </div>

      {/* Transaction Info Card */}
      <div className="bg-white p-6 rounded-card shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Customer</h3>
            <p className="text-lg font-semibold">
              {transaction.account?.customerName || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Transaction Date</h3>
            <p className="text-lg font-semibold">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Principal Amount</h3>
            <p className="text-lg font-semibold">
              ₹{transaction.principal?.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Interest Rate</h3>
            <p className="text-lg font-semibold">
              {transaction.interestRate}%{" "}
              {transaction.paymentFrequency === "Yearly"
                ? "per year"
                : "per month"}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">Duration</h3>
            <p className="text-lg font-semibold">
              {transaction.durationMonths} months
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-1">
              Total Amount (with Interest)
            </h3>
            <p className="text-lg font-semibold text-primary">
              ₹{transaction.totalAmount?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className="bg-white p-6 rounded-card shadow-card">
        <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 mb-1">Paid Amount</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{transaction.paidAmount?.toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 mb-1">Outstanding</h3>
            <p className="text-2xl font-bold text-orange-600">
              ₹{outstanding?.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 mb-1">Status</h3>
            <p className="text-2xl font-bold text-blue-600">{status}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-card shadow-card">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No payments recorded yet
          </p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">
                    ₹{payment.amount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.date).toLocaleDateString()} •{" "}
                    {payment.method}
                  </p>
                  {payment.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {payment.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
