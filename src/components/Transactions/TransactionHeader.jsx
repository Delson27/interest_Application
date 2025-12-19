import { useNavigate } from "react-router-dom";

export default function TransactionHeader() {
  const navigate = useNavigate(); //  used for navigating between routes

  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-textDark">Transactions</h1>
        <p className="text-textLight text-sm">
          Manage all lending & borrowing records
        </p>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search name, keyword..."
          className="flex-1 md:w-64 p-3 border rounded-lg bg-white shadow-sm focus:outline-primary"
        />

        <button
          onClick={() => navigate("/transactions/add")}
          className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
