export default function PreviewCard({ principal, interest, total, months }) {
  return (
    <div className="bg-white p-4 rounded-card border shadow-card grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-xs text-textLight">Principal</p>
        <p className="font-semibold">₹ {principal}</p>
      </div>
      <div>
        <p className="text-xs text-textLight">Interest</p>
        <p className="font-semibold">₹ {interest}</p>
      </div>
      <div>
        <p className="text-xs text-textLight">Total</p>
        <p className="font-semibold">₹ {total}</p>
      </div>
      <div>
        <p className="text-xs text-textLight">Period</p>
        <p className="font-semibold">{months} months</p>
      </div>
    </div>
  );
}
