import useAuth from "../hooks/useAuth";
import "../styles/home.css";

export default function Home() {
  const { user } = useAuth();
  console.log(user);
  

  return (
    <div className="home">
      <nav className="navbar">
        <span className="logo">MyApp</span>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-username">👋 {user.username || user.email}</span>
              <button className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register" className="btn-signup">Sign Up</a>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        {user ? (
          <>
            <h1>Welcome back, {user.username || user.email} 🎉</h1>
            <p>Good to have you here. Pick up right where you left off.</p>
            <div className="hero-btns">
              <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to MyApp</h1>
            <p>A simple and clean application for everyone.</p>
            <div className="hero-btns">
              <a href="/register" className="btn-primary">Get Started</a>
              <a href="/login" className="btn-outline">Login</a>
            </div>
          </>
        )}
      </section>

      <footer className="footer">
        <p>© 2026 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
}