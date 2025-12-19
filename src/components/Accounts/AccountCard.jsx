import { useNavigate } from "react-router-dom";

export default function AccountCard({
  _id,
  customerName,
  email,
  phone,
  accountType,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 rounded-card shadow-card border flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-textDark">{customerName}</h3>
        <p className="text-textLight text-sm mt-1">
          {accountType || "Customer"}
        </p>
        <p className="text-textLight text-sm mt-1">{email}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm">{phone}</p>
        <button
          onClick={() => navigate(`/accounts/${_id}`)}
          className="text-primary text-sm font-medium hover:underline"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
