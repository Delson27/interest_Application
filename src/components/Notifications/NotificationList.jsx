import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDuePayments, getUpcomingPayments } from "../../services/api";

export default function NotificationList() {
  const { token } = useAuth();
  const [duePayments, setDuePayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([getDuePayments(token), getUpcomingPayments(token)])
        .then(([dueRes, upcomingRes]) => {
          setDuePayments(dueRes.data || dueRes || []);
          setUpcomingPayments(upcomingRes.data || upcomingRes || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Due Payments */}
      {duePayments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-3">
            Overdue Payments ({duePayments.length})
          </h3>
          <div className="space-y-2">
            {duePayments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white p-3 rounded border border-red-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Outstanding: ₹{payment.outstanding?.toLocaleString()} •{" "}
                      {payment.daysOverdue} days overdue
                    </p>
                    <p className="text-xs text-gray-500">
                      Due Date: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    Overdue
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-3">
            Upcoming Payments ({upcomingPayments.length})
          </h3>
          <div className="space-y-2">
            {upcomingPayments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white p-3 rounded border border-yellow-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Outstanding: ₹{payment.outstanding?.toLocaleString()} •
                      Due in {payment.daysUntilDue} days
                    </p>
                    <p className="text-xs text-gray-500">
                      Due Date: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                    Upcoming
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Notifications */}
      {duePayments.length === 0 && upcomingPayments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No payment reminders at the moment 🎉</p>
          <p className="text-sm mt-2">All payments are up to date!</p>
        </div>
      )}
    </div>
  );
}
