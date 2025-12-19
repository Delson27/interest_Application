import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#5878FF", "#8DA2FF", "#B5C1FF", "#DDE6FF"];

export default function PortfolioPieChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card shadow-card border h-80">
        <h3 className="font-semibold mb-4">Portfolio Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No portfolio data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-card shadow-card border h-80">
      <h3 className="font-semibold mb-4">Portfolio Distribution</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
