import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../services/api";
import { useCategories } from "../hooks/useCategories";

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: 32, width: 460, maxWidth: "90vw",
    animation: "slideUp 0.2s ease",
  },
  title: {
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20,
    marginBottom: 24, color: "var(--text)",
  },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" },
  input: {
    width: "100%", padding: "10px 14px", background: "var(--surface2)",
    border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)",
    fontSize: 14, outline: "none", transition: "border-color 0.15s",
  },
  row: { display: "flex", gap: 12 },
  actions: { display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" },
  btnCancel: {
    padding: "10px 20px", background: "transparent", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text-muted)", fontSize: 14,
  },
  btnSubmit: {
    padding: "10px 24px", background: "var(--accent)", border: "none",
    borderRadius: 8, color: "#0a0a0f", fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)",
  },
  error: { color: "var(--red)", fontSize: 13, marginTop: 12 },
};

const today = new Date().toISOString().split("T")[0];

export default function ExpenseForm({ expense, onClose, onSaved }) {
  const { categories } = useCategories();
  const [form, setForm] = useState({
    title: expense?.title || "",
    amount: expense?.amount || "",
    category_id: expense?.category_id || "",
    date: expense?.date || today,
    note: expense?.note || "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (categories.length && !form.category_id) {
      setForm((f) => ({ ...f, category_id: categories[0].id }));
    }
  }, [categories]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.amount || parseFloat(form.amount) <= 0) return setError("Amount must be greater than zero.");
    if (!form.category_id) return setError("Please select a category.");

    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, amount: parseFloat(form.amount), category_id: parseInt(form.category_id) };
      if (expense?.id) {
        await updateExpense(expense.id, payload);
      } else {
        await createExpense(payload);
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`@keyframes slideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }`}</style>
      <div style={s.modal}>
        <div style={s.title}>{expense ? "Edit Expense" : "New Expense"}</div>

        <div style={s.field}>
          <label style={s.label}>Title</label>
          <input style={s.input} value={form.title} onChange={set("title")} placeholder="What did you spend on?" />
        </div>

        <div style={{ ...s.row }}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Amount (₹)</label>
            <input style={s.input} type="number" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0.00" />
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.date} onChange={set("date")} />
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Category</label>
          <select style={s.input} value={form.category_id} onChange={set("category_id")}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={s.field}>
          <label style={s.label}>Note (optional)</label>
          <input style={s.input} value={form.note} onChange={set("note")} placeholder="Any details..." />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.actions}>
          <button style={s.btnCancel} onClick={onClose}>Cancel</button>
          <button style={s.btnSubmit} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : expense ? "Update" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
