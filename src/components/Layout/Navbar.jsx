import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Welcome</h2>

      <div className="flex items-center gap-3">
        {/* User Profile Button */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {initial}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{displayName}</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </button>
      </div>
    </header>
  );
}
