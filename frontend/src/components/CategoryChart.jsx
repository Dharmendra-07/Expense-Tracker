import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{name}</div>
      <div style={{ color: "var(--accent)", fontWeight: 700 }}>
        ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}

export default function CategoryChart({ byCategory }) {
  const data = Object.entries(byCategory).map(([name, info]) => ({
    name,
    value: info.total,
    color: info.color,
    count: info.count,
  }));

  if (!data.length) return <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>No data</div>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
