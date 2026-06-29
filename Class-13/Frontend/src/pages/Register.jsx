import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { handleRegister, loading, error } = useAuth();

  async function handleClick(e) {
    e.preventDefault();
    const res = await handleRegister(payload);
    if (res?.success) {
      navigate("/home");
    }
  }

  return (
    <div className="page">
      <div className="right-panel">
        <div className="form-box">
          <h2>Create Account</h2>
          <p className="sub">Join us — it only takes a minute</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleClick}>
            <div className="field">
              <input
                id="username"
                type="text"
                placeholder=" "
                value={payload.username}
                onChange={(e) => {
                  setPayload({ ...payload, username: e.target.value });
                }}
              />
              <label htmlFor="username">Username</label>
              <span className="field-icon">👤</span>
            </div>
            <div className="field">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={payload.email}
                onChange={(e) => {
                  setPayload({ ...payload, email: e.target.value });
                }}
              />
              <label htmlFor="email">Email address</label>
              <span className="field-icon">✉</span>
            </div>

            <div className="field">
              <input
                id="password"
                type="password"
                placeholder=" "
                value={payload.password}
                onChange={(e) => {
                  setPayload({ ...payload, password: e.target.value });
                }}
              />
              <label htmlFor="password">Password</label>
              <span className="field-icon">🔒</span>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? <div className="loader"></div> : "Create Account"}
            </button>
          </form>

          <p className="switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="left-panel">
        <div className="brand">⬡ MyApp</div>
        <div className="panel-text">
          <h1>
            Start your
            <br />
            journey today.
          </h1>
          <p>Create an account and unlock everything MyApp has to offer.</p>
        </div>
        <div className="panel-circles">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="circle c3" />
        </div>
      </div>
    </div>
  );
}
