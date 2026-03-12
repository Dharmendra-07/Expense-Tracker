import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";

const MONTHS = ["All","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();

const s = {
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 },
  h1: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-1px" },
  btnAdd: {
    padding: "12px 24px", background: "var(--accent)", border: "none",
    borderRadius: 8, color: "#0a0a0f", fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)", cursor: "pointer",
  },
  filterRow: { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" },
  select: {
    padding: "8px 14px", background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: 14,
  },
  card: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", overflow: "hidden",
  },
  error: { color: "var(--red)", padding: 24 },
  total: {
    padding: "14px 20px", borderTop: "1px solid var(--border)",
    display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center",
    color: "var(--text-muted)", fontSize: 13,
  },
  totalAmt: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--accent)" },
};

function fmt(n) {
  return "₹" + parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(now.getFullYear());
  const [categoryId, setCategoryId] = useState("");

  const { categories } = useCategories();
  const filters = {
    ...(month > 0 ? { month } : {}),
    year,
    ...(categoryId ? { category_id: categoryId } : {}),
  };
  const { expenses, summary, loading, error, reload, remove } = useExpenses(filters);

  const years = [now.getFullYear(), now.getFullYear() - 1];

  return (
    <div>
      <div style={s.header}>
        <div style={s.h1}>All Expenses</div>
        <button style={s.btnAdd} onClick={() => setShowForm(true)}>+ Add Expense</button>
      </div>

      <div style={s.filterRow}>
        <select style={s.select} value={month} onChange={(e) => setMonth(+e.target.value)}>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select style={s.select} value={year} onChange={(e) => setYear(+e.target.value)}>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select style={s.select} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.card}>
        {loading ? (
          <div style={{ padding: 32, color: "var(--text-muted)" }}>Loading…</div>
        ) : (
          <>
            <ExpenseList expenses={expenses} onRemove={remove} onRefresh={reload} />
            {expenses.length > 0 && (
              <div style={s.total}>
                <span>{expenses.length} transaction{expenses.length !== 1 ? "s" : ""}</span>
                <span style={s.totalAmt}>{fmt(summary?.total)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); reload(); }}
        />
      )}
    </div>
  );
}
