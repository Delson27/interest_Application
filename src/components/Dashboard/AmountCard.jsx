import { useNavigate } from "react-router-dom";

export default function AmountCard({ title, value, actionText, button }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-card shadow-card border">
      <h3 className="text-textLight text-sm">{title}</h3>

      {!button ? (
        <>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {actionText && (
            <button className="mt-3 text-primary font-medium hover:underline">
              {actionText}
            </button>
          )}
        </>
      ) : (
        <button
          onClick={() => navigate("/transactions/add")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          + Add Transaction
        </button>
      )}
    </div>
  );
}
