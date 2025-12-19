import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccountById, getTransactions } from "../services/api";
import { exportAccountPDF } from "../utils/export";

export default function AccountProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && id) {
      Promise.all([getAccountById(id, token), getTransactions(token)])
        .then(([accountData, transactionsData]) => {
          setAccount(accountData.account || accountData);
          // Filter transactions for this account
          const accountTransactions = transactionsData.filter(
            (t) => t.account?._id === id || t.account === id
          );
          setTransactions(accountTransactions);
        })
        .catch((error) => {
          console.error("Error fetching account:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleExportPDF = () => {
    if (account && transactions) {
      exportAccountPDF(account, transactions);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Account not found</div>
      </div>
    );
  }

  // Calculate totals
  const totalLent = transactions
    .filter((t) => t.type === "LENT")
    .reduce((sum, t) => sum + (t.principal || 0), 0);

  const totalBorrowed = transactions
    .filter((t) => t.type === "BORROWED")
    .reduce((sum, t) => sum + (t.principal || 0), 0);

  const totalPaid = transactions.reduce(
    (sum, t) => sum + (t.paidAmount || 0),
    0
  );

  const outstanding = transactions.reduce(
    (sum, t) => sum + ((t.totalAmount || 0) - (t.paidAmount || 0)),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/accounts")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Account Profile</h1>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Customer Name</p>
            <p className="text-lg font-medium text-gray-800">
              {account.customerName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Type</p>
            <p className="text-lg font-medium text-gray-800">
              {account.accountType || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-800">
              {account.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-medium text-gray-800">
              {account.phone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-2">Total Lent</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalLent.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-2">Total Borrowed</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalBorrowed.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-2">Total Paid</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{totalPaid.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-2">Outstanding</p>
          <p className="text-2xl font-bold text-orange-600">
            ₹{outstanding.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No transactions found for this account
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Interest
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === "LENT"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.type === "LENT" ? "Lent" : "Borrowed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">
                      ₹{(transaction.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.interestRate || 0}%
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(transaction.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "SETTLED"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          navigate(`/transactions/${transaction._id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
