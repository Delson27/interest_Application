export default function AccountTabs({ activeTab, onTabChange }) {
  const tabs = ["Investors", "My Accounts"];

  return (
    <div className="flex gap-3">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            tab === activeTab
              ? "bg-primary text-white"
              : "bg-chipBlue text-textDark hover:bg-primary hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
