import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendNotificationReminder } from "../../services/api";

export default function SendReminderModal({ payment, onClose, onSuccess }) {
  const { token } = useAuth();
  const [sending, setSending] = useState(false);
  const [method, setMethod] = useState("email");
  const [message, setMessage] = useState(
    `Dear ${payment.customerName},\n\nThis is a reminder that your payment of ₹${payment.amount?.toLocaleString()} is due on ${new Date(payment.dueDate).toLocaleDateString()}.\n\nPlease make the payment at your earliest convenience.\n\nThank you!`
  );

  const handleSend = async () => {
    setSending(true);
    try {
      await sendNotificationReminder(payment._id, { method, message }, token);
      alert(`Reminder sent via ${method}!`);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to send reminder: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Send Payment Reminder</h2>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-medium">{payment.customerName}</p>
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Send Via</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {method === "email" && "Email notification will be sent"}
              {method === "sms" && "SMS feature coming soon"}
              {method === "whatsapp" && "WhatsApp feature coming soon"}
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="6"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {sending ? "Sending..." : "Send Reminder"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
