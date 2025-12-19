import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const displayName = user?.name || "User";

  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card">
      <h1 className="text-2xl font-semibold text-textDark">
        Hello {displayName}!
      </h1>
      <p className="text-textLight mt-1">Welcome</p>

      <input
        type="text"
        placeholder="Search name, keyword..."
        className="mt-4 w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-primary"
      />
    </div>
  );
}
