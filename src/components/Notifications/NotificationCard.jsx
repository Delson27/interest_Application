export default function NotificationCard({ title, message, time }) {
  return (
    <div className="bg-white p-4 rounded-card shadow-card border flex items-center justify-between">
      <div>
        <p className="font-semibold text-textDark">{title}</p>
        <p className="text-textLight text-sm">{message}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-textLight">{time}</span>
        <button className="text-primary text-sm font-medium hover:underline">
          More
        </button>
      </div>
    </div>
  );
}
