import TransactionHeader from "../components/Transactions/TransactionHeader";
import TransactionRow from "../components/Transactions/TransactionRow";
import FilterTabs from "../components/Transactions/FilterTabs";
import { getTransactions } from "../services/api";
import EmptyState from "../components/UI/EmptyState";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Transactions() {
  const { token } = useAuth();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const data = await getTransactions(token);
          console.log("Transactions received:", data);
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [token, location.key]);

  // Filter transactions based on active filter
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "All") return true;

    // Map filter names to status values
    const statusMap = {
      Active: "ACTIVE",
      Due: "OVERDUE",
      Paid: "COMPLETED",
    };

    return tx.status === statusMap[activeFilter];
  });

  //  LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  //  EMPTY STATE GOES HERE
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Yet"
        message="Add your first transaction to start tracking interest."
        action={
          <Link to="/transactions/add" className="text-primary font-medium">
            + Add Transaction
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <TransactionHeader />
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="bg-cardBlue p-4 rounded-card shadow-card space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No {activeFilter.toLowerCase()} transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionRow key={tx._id} {...tx} />
          ))
        )}
      </div>
    </div>
  );
}
