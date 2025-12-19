export default function NotificationHeader() {
  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card">
      <h1 className="text-2xl font-semibold text-textDark">Notifications</h1>

      <input
        type="text"
        placeholder="Search name, keyword..."
        className="mt-4 w-full p-3 border rounded-lg bg-white shadow-sm focus:outline-primary"
      />
    </div>
  );
}
