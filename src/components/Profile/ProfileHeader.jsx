import { useAuth } from "../../context/AuthContext";

export default function ProfileHeader() {
  const { user } = useAuth();

  // Get first letter of name for avatar
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const displayName = user?.name || "User";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primaryLight flex items-center justify-center text-primary text-xl font-bold">
        {initial}
      </div>

      <div>
        <h1 className="text-xl font-semibold text-textDark">{displayName}</h1>
        <p className="text-textLight text-sm">{displayRole} Account</p>
      </div>
    </div>
  );
}
