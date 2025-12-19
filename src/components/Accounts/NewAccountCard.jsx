import { useNavigate } from "react-router-dom";

export default function NewAccountCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/accounts/add")}
      className="border-2 border-dashed rounded-card p-6 flex flex-col items-center justify-center text-center text-textLight hover:border-primary cursor-pointer transition-colors"
    >
      <p className="text-lg font-semibold text-primary">+ New Account</p>
      <p className="text-sm mt-1">Add Investor or Customer</p>
    </div>
  );
}
