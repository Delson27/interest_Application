export default function ProfileSection({ title, children }) {
  return (
    <div className="bg-white rounded-card shadow-card border">
      {title && (
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-textDark">{title}</h2>
        </div>
      )}
      <div className="divide-y">{children}</div>
    </div>
  );
}
