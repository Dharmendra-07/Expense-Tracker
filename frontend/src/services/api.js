import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
    return Promise.reject(new Error(typeof message === "object" ? JSON.stringify(message) : message));
  }
);

// Expenses
export const getExpenses = (params = {}) => api.get("/expenses", { params }).then((r) => r.data);
export const getExpense = (id) => api.get(`/expenses/${id}`).then((r) => r.data);
export const createExpense = (data) => api.post("/expenses", data).then((r) => r.data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`).then((r) => r.data);
export const getSummary = (params = {}) => api.get("/expenses/summary", { params }).then((r) => r.data);

// Categories
export const getCategories = () => api.get("/categories").then((r) => r.data);
export const createCategory = (data) => api.post("/categories", data).then((r) => r.data);
