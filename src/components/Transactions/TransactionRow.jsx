import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function TransactionRow({
  _id,
  account,
  principal,
  interestRate,
  totalAmount,
  type,
  date,
  status,
  durationMonths,
}) {
  const navigate = useNavigate();
  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Calculate interest amount
  const interestAmount = totalAmount - principal;

  // Get customer name - handle when account is null, undefined, or just an ID object
  const customerName =
    account?.customerName ||
    (typeof account === "object" && account?._id
      ? "Account Not Found"
      : "Unknown");

  return (
    <div
      onClick={() => navigate(`/transactions/${_id}`)}
      className="bg-white p-4 rounded-card shadow-card border flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Left Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-textDark">{customerName}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              type === "LENT"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {type === "LENT" ? "Lent" : "Borrowed"}
          </span>
        </div>
        <p className="text-textLight text-xs mt-1">
          {formattedDate} • {interestRate}% for {durationMonths} months
        </p>
      </div>

      {/* Right Info */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-gray-500">Principal</p>
          <p className="font-semibold text-gray-700">
            ₹{principal?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Interest</p>
          <p className="font-semibold text-blue-600">
            ₹{interestAmount?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-primary text-lg">
            ₹{totalAmount?.toLocaleString()}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
