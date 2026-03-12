import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "expenses", label: "Expenses" },
];

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 220,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "32px 0",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 20,
    padding: "0 24px 32px",
    letterSpacing: "-0.5px",
  },
  logoAccent: { color: "var(--accent)" },
  nav: { display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" },
  navItem: (active) => ({
    padding: "10px 16px",
    borderRadius: 8,
    background: active ? "var(--accent-dim)" : "transparent",
    color: active ? "var(--accent)" : "var(--text-muted)",
    fontWeight: active ? 600 : 400,
    fontFamily: "var(--font-display)",
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    textAlign: "left",
    transition: "all 0.15s",
  }),
  main: {
    marginLeft: 220,
    flex: 1,
    padding: "40px 48px",
    maxWidth: "calc(100vw - 220px)",
  },
};

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          expense<span style={styles.logoAccent}>.</span>
        </div>
        <nav style={styles.nav}>
          {NAV.map((n) => (
            <button key={n.id} style={styles.navItem(page === n.id)} onClick={() => setPage(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
      </aside>
      <main style={styles.main}>
        {page === "dashboard" && <Dashboard />}
        {page === "expenses" && <ExpensesPage />}
      </main>
    </div>
  );
}
