import React, { useState } from "react";
import ExpenseForm from "./ExpenseForm";

const s = {
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600,
    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em",
    borderBottom: "1px solid var(--border)",
  },
  tr: { borderBottom: "1px solid var(--border)", transition: "background 0.1s" },
  td: { padding: "14px 12px", fontSize: 14 },
  badge: (color) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "3px 10px", borderRadius: 20, fontSize: 12,
    background: color + "22", color: color, fontWeight: 500,
  }),
  dot: (color) => ({ width: 6, height: 6, borderRadius: "50%", background: color }),
  amount: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 },
  note: { color: "var(--text-muted)", fontSize: 12, marginTop: 2 },
  actions: { display: "flex", gap: 8 },
  btnEdit: {
    padding: "5px 12px", background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 6, color: "var(--text-muted)", fontSize: 12, cursor: "pointer",
  },
  btnDel: {
    padding: "5px 12px", background: "transparent", border: "1px solid transparent",
    borderRadius: 6, color: "var(--red)", fontSize: 12, cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "48px 0", color: "var(--text-muted)" },
};

function fmt(amount) {
  return "₹" + parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ExpenseList({ expenses, onRemove, onRefresh }) {
  const [editing, setEditing] = useState(null);

  if (!expenses.length) {
    return <div style={s.empty}>No expenses found. Add one to get started!</div>;
  }

  return (
    <>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Title</th>
            <th style={s.th}>Category</th>
            <th style={s.th}>Date</th>
            <th style={s.th}>Amount</th>
            <th style={s.th}></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} style={s.tr}>
              <td style={s.td}>
                <div>{e.title}</div>
                {e.note && <div style={s.note}>{e.note}</div>}
              </td>
              <td style={s.td}>
                <span style={s.badge(e.category?.color || "#6b7280")}>
                  <span style={s.dot(e.category?.color || "#6b7280")} />
                  {e.category?.name || "—"}
                </span>
              </td>
              <td style={{ ...s.td, color: "var(--text-muted)" }}>{fmtDate(e.date)}</td>
              <td style={{ ...s.td, ...s.amount }}>{fmt(e.amount)}</td>
              <td style={s.td}>
                <div style={s.actions}>
                  <button style={s.btnEdit} onClick={() => setEditing(e)}>Edit</button>
                  <button style={s.btnDel} onClick={() => onRemove(e.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <ExpenseForm
          expense={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onRefresh(); }}
        />
      )}
    </>
  );
}
