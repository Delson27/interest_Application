import AccountHeader from "../components/Accounts/AccountHeader";
import AccountTabs from "../components/Accounts/AccountTabs";
import AccountCard from "../components/Accounts/AccountCard";
import NewAccountCard from "../components/Accounts/NewAccountCard";
import EmptyState from "../components/UI/EmptyState";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAccounts } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Accounts() {
  const { token } = useAuth();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("My Accounts");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      if (token) {
        try {
          const data = await getAccounts(token);
          setAccounts(data);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        }
      }
    };

    fetchAccounts();
  }, [token, location.key]);

  // Filter accounts based on active tab
  let filteredAccounts =
    activeTab === "Investors"
      ? accounts.filter((acc) => acc.accountType === "Investor")
      : accounts;

  // Apply search filter
  if (searchTerm.trim()) {
    filteredAccounts = filteredAccounts.filter(
      (acc) =>
        acc.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.phone?.includes(searchTerm) ||
        acc.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  //  EMPTY STATE - Still show the option to add
  if (accounts.length === 0) {
    return (
      <div className="space-y-6">
        <AccountHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <EmptyState
          title="No Accounts Found"
          message="Add an investor or customer to begin."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewAccountCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AccountHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Tabs */}
      <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAccounts.map((acc) => (
          <AccountCard key={acc._id} {...acc} />
        ))}

        {/* New Investor / Customer */}
        <NewAccountCard />
      </div>

      {/* Show message if filter returns no results */}
      {filteredAccounts.length === 0 && accounts.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No {activeTab === "Investors" ? "investors" : "accounts"} found</p>
          <p className="text-sm mt-2">
            Try switching tabs or add a new account
          </p>
        </div>
      )}
    </div>
  );
}
