export default function QuickChip({ amount, label }) {
  return (
    <div className="px-4 py-2 bg-chipBlue rounded-full shadow-sm text-textDark flex flex-col items-center">
      <span className="font-semibold">{amount}</span>
      <span className="text-xs text-textLight">{label}</span>
    </div>
  );
}
