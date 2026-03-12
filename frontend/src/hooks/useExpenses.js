import { useState, useEffect, useCallback } from "react";
import { getExpenses, getSummary, deleteExpense } from "../services/api";

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [exp, sum] = await Promise.all([
        getExpenses(filters),
        getSummary({ month: filters.month, year: filters.year }),
      ]);
      setExpenses(exp);
      setSummary(sum);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    await deleteExpense(id);
    await load();
  };

  return { expenses, summary, loading, error, reload: load, remove };
}
