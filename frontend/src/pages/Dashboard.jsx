import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import SummaryCard from "../components/SummaryCard";
import CategoryChart from "../components/CategoryChart";
import ExpenseForm from "../components/ExpenseForm";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const s = {
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 },
  h1: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, letterSpacing: "-1px" },
  h1Accent: { color: "var(--accent)" },
  sub: { color: "var(--text-muted)", fontSize: 14, marginTop: 4 },
  btnAdd: {
    padding: "12px 24px", background: "var(--accent)", border: "none",
    borderRadius: 8, color: "#0a0a0f", fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)", cursor: "pointer",
  },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  card: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: 24,
  },
  cardTitle: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 20 },
  monthRow: { display: "flex", alignItems: "center", marginBottom: 12, gap: 12 },
  monthLabel: { fontSize: 13, width: 28, color: "var(--text-muted)" },
  monthBar: (pct, color) => ({
    height: 8, borderRadius: 4, width: `${pct}%`, background: color || "var(--accent)",
    transition: "width 0.4s ease",
  }),
  monthAmount: { fontSize: 13, color: "var(--text-muted)", marginLeft: "auto", whiteSpace: "nowrap" },
  filterRow: { display: "flex", gap: 12, marginBottom: 32, alignItems: "center" },
  select: {
    padding: "8px 14px", background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: 14, cursor: "pointer",
  },
};

function fmt(n) {
  return "₹" + parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

const now = new Date();

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { summary, loading, reload } = useExpenses({ month, year });

  const years = [now.getFullYear(), now.getFullYear() - 1];

  const categoryData = summary?.by_category || {};
  const maxCat = Math.max(...Object.values(categoryData).map((v) => v.total), 1);

  return (
    <div>
      <div style={s.header}>
        <div>
          <div style={s.h1}>
            Your <span style={s.h1Accent}>Expenses</span>
          </div>
          <div style={s.sub}>Track, understand, and control your spending.</div>
        </div>
        <button style={s.btnAdd} onClick={() => setShowForm(true)}>+ Add Expense</button>
      </div>

      <div style={s.filterRow}>
        <select style={s.select} value={month} onChange={(e) => setMonth(+e.target.value)}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select style={s.select} value={year} onChange={(e) => setYear(+e.target.value)}>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)", padding: 24 }}>Loading…</div>
      ) : (
        <>
          <div style={s.grid3}>
            <SummaryCard label="Total Spent" value={fmt(summary?.total)} sub={`${MONTHS[month - 1]} ${year}`} accent />
            <SummaryCard label="Transactions" value={summary?.count ?? 0} sub="This month" />
            <SummaryCard label="Categories" value={Object.keys(categoryData).length} sub="Active this month" />
          </div>

          <div style={s.grid2}>
            <div style={s.card}>
              <div style={s.cardTitle}>Spending by Category</div>
              {Object.entries(categoryData).length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>No expenses this month.</div>
              ) : (
                Object.entries(categoryData)
                  .sort((a, b) => b[1].total - a[1].total)
                  .map(([name, info]) => (
                    <div key={name} style={s.monthRow}>
                      <span style={s.monthLabel}>{name.slice(0, 3)}</span>
                      <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={s.monthBar((info.total / maxCat) * 100, info.color)} />
                      </div>
                      <span style={s.monthAmount}>{fmt(info.total)}</span>
                    </div>
                  ))
              )}
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>Distribution</div>
              <CategoryChart byCategory={categoryData} />
            </div>
          </div>
        </>
      )}

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload(); }}
        />
      )}
    </div>
  );
}
