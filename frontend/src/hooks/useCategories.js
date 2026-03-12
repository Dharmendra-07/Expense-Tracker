import { useState, useEffect } from "react";
import { getCategories } from "../services/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
