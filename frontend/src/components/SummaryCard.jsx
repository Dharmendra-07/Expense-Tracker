import React from "react";

const s = {
  card: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: 24,
  },
  label: { fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  value: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--text)", lineHeight: 1 },
  sub: { fontSize: 13, color: "var(--text-muted)", marginTop: 6 },
  accent: { color: "var(--accent)" },
};

export default function SummaryCard({ label, value, sub, accent }) {
  return (
    <div style={s.card}>
      <div style={s.label}>{label}</div>
      <div style={{ ...s.value, ...(accent ? s.accent : {}) }}>{value}</div>
      {sub && <div style={s.sub}>{sub}</div>}
    </div>
  );
}
