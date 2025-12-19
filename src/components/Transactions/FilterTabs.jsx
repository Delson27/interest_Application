export default function FilterTabs({ activeFilter = "All", onFilterChange }) {
  const tabs = ["All", "Active", "Due", "Paid"];

  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            tab === activeFilter
              ? "bg-primary text-white"
              : "bg-chipBlue text-textDark hover:bg-primaryLight"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
