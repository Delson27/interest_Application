export default function Section({ title, children }) {
  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
