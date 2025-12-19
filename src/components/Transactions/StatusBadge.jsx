export default function StatusBadge({ status }) {
  const styles = {
    Active: "bg-blue-100 text-blue-700",
    Due: "bg-red-100 text-red-700",
    Paid: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        styles[status] || "bg-gray-200 text-gray-700" // default style  || if status not found
      }`}
    >
      {status}
    </span>
  );
}
