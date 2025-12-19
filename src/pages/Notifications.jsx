import NotificationsHeader from "../components/Notifications/NotificationHeader";
import NotificationList from "../components/Notifications/NotificationList";
import { getNotifications } from "../services/api";
import EmptyState from "../components/UI/EmptyState";
import { useState, useEffect } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    overdue: [],
    upcoming: [],
    recentPayments: [],
  });
  const [activeTab, setActiveTab] = useState("reminders");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && activeTab === "general") {
      setLoading(true);
      getNotifications(token)
        .then((data) => {
          setNotifications(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const hasNoNotifications = notifications.recentPayments?.length === 0;

  return (
    <div className="space-y-6">
      <NotificationsHeader />

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("reminders")}
          className={`px-4 py-2 font-medium ${
            activeTab === "reminders"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
        >
          Payment Reminders
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium ${
            activeTab === "general"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
        >
          General Notifications
        </button>
      </div>

      {/* Content */}
      {activeTab === "reminders" ? (
        <NotificationList />
      ) : (
        <>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : hasNoNotifications ? (
            <EmptyState
              title="No Recent Activity"
              message="You're all caught up 🎉"
            />
          ) : (
            <div className="space-y-4">
              {/* Recent Payments */}
              {notifications.recentPayments?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Payments
                  </h3>
                  <div className="space-y-3">
                    {notifications.recentPayments.map((payment) => (
                      <div
                        key={payment._id}
                        className="border-l-4 border-green-500 pl-4 py-2"
                      >
                        <p className="font-medium text-gray-900">
                          Payment Received: ₹{payment.amount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          From: {payment.customerName} • Method:{" "}
                          {payment.method}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
