import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn btn-secondary"
      style={{
        position: "fixed",
        top: "24px",
        right: "32px",
        zIndex: 1000,
        borderRadius: "50%",
        width: "54px",
        height: "54px",
        padding: 0,
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
