export default function EmptyState({ title, message, action }) {
  return (
    <div className="bg-cardBlue p-8 rounded-card text-center">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-textLight mb-4">{message}</p>
      {action}
    </div>
  );
}
