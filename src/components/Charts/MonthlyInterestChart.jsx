import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MonthlyInterestChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card shadow-card border h-80">
        <h3 className="font-semibold mb-4">Monthly Interest</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No interest data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-card shadow-card border h-80">
      <h3 className="font-semibold mb-4">Monthly Interest</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="interest"
            stroke="#5878FF"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
