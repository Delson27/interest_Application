import DashboardHeader from "../components/Dashboard/DashboardHeader";
import AmountCard from "../components/Dashboard/AmountCard";
import QuickChip from "../components/Dashboard/QuickChip";
import InvestorCard from "../components/Dashboard/InvestorCard";
import SectionCard from "../components/Dashboard/SectionCard";
import PortfolioPieChart from "../components/Charts/PortfolioPieChart";
import MonthlyInterestChart from "../components/Charts/MonthlyInterestChart";
import ExportButton from "../components/Dashboard/ExportButton";
import { getAnalytics, getTransactions, getUser } from "../services/api";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    portfolio: [],
    monthlyInterest: [],
    availableAmount: 0,
    totalRedeem: 0,
    quickAmounts: [],
  });
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAnalytics(token).then(setAnalytics).catch(console.error);
      getTransactions(token).then(setTransactions).catch(console.error);
      getUser(token).then(setUser).catch(console.error);
    }
  }, []);

  const investors = transactions.slice(0, 3);

  // Calculate summary for export
  const summary = {
    totalLent: transactions
      .filter((t) => t.type === "LENT")
      .reduce((sum, t) => sum + (t.principal || 0), 0),
    totalReceived: transactions
      .filter((t) => t.type === "BORROWED")
      .reduce((sum, t) => sum + (t.principal || 0), 0),
    outstanding: transactions.reduce(
      (sum, t) => sum + ((t.totalAmount || 0) - (t.paidAmount || 0)),
      0
    ),
    activeAccounts: new Set(transactions.map((t) => t.account?._id)).size,
  };

  return (
    <div className="space-y-6">
      {/* Greeting + Search + Export */}
      <div className="flex items-center justify-between">
        <DashboardHeader />
        {transactions.length > 0 && user && (
          <ExportButton
            transactions={transactions}
            summary={summary}
            userName={user.name || user.email}
          />
        )}
      </div>

      {/* Amount Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AmountCard
          title="Available Amount"
          value={`₹ ${
            analytics.availableAmount?.toLocaleString("en-IN") || "0.00"
          }`}
          actionText="Redeem Now"
        />
        <AmountCard
          title="Total Redeem"
          value={`₹ ${
            analytics.totalRedeem?.toLocaleString("en-IN") || "0.00"
          }`}
          actionText="View History"
        />
        <AmountCard title="Add Transactions" button />
      </div>

      {/* Quick chips row */}
      {analytics.quickAmounts && analytics.quickAmounts.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {analytics.quickAmounts.map((item, i) => (
            <QuickChip key={i} amount={item.amount} label={item.label} />
          ))}
        </div>
      )}

      {/* Investor Performance Section */}
      <SectionCard title="Investor Performance">
        <div className="space-y-4">
          {investors.map((inv, i) => (
            <InvestorCard key={i} {...inv} />
          ))}
        </div>
      </SectionCard>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioPieChart data={analytics.portfolio} />
        <MonthlyInterestChart data={analytics.monthlyInterest} />
      </div>
    </div>
  );
}
