export default function InvestorCard({
  account,
  date,
  interestRate,
  principal,
  durationMonths,
  type,
}) {
  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const displayName = account?.customerName || "Unknown";
  const displayAmount = principal
    ? `₹${principal.toLocaleString("en-IN")}`
    : "₹0";
  const displayInterest = `${interestRate || 0}% for ${
    durationMonths || 0
  } months`;

  return (
    <div className="bg-white p-4 rounded-card shadow-card border flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{displayName}</p>
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
        <p className="text-textLight text-xs">
          {formattedDate} • {displayInterest}
        </p>
      </div>
      <p className="font-bold text-primary">{displayAmount}</p>
    </div>
  );
}
