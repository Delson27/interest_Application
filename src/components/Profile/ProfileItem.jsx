export default function ProfileItem({ label }) {
  return (
    <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50">
      <span className="text-textDark">{label}</span>
      <span className="text-textLight">{">"}</span>
    </button>
  );
}
