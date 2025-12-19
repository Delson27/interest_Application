export default function SectionCard({ title, children }) {
  return (
    <div className="bg-cardBlue p-6 rounded-card shadow-card">
      <h2 className="text-xl font-semibold mb-4 text-textDark">{title}</h2>
      {children}
    </div>
  );
}
