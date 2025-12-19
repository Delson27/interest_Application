import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSection from "../components/Profile/ProfileSection";
import ProfileItem from "../components/Profile/ProfileItem";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader />

      {/* Preferences */}

      <ProfileSection title="Preferences">
        <ProfileItem label="Change Language" />
        <ProfileItem label="Theme" />
        <ProfileItem label="Settings" />
      </ProfileSection>

      {/* Data & Storage */}
      <ProfileSection title="Data & Storage">
        <ProfileItem label="Fields" />
        <ProfileItem label="Storage" />
        <ProfileItem label="Export" />
      </ProfileSection>

      {/* Support */}
      <ProfileSection title="Support">
        <ProfileItem label="Support Portal" />
        <ProfileItem label="User Manual" />
        <ProfileItem label="Contact" />
      </ProfileSection>

      {/* Logout */}
      <ProfileSection>
        <button
          onClick={handleLogout}
          className="w-full p-4 text-red-600 font-semibold rounded-card border border-red-200 hover:bg-red-50"
        >
          Log Out
        </button>
      </ProfileSection>
    </div>
  );
}
