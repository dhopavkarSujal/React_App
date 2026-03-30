import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ngoLogin.css";

function NgoLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/ngo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    navigate("/ngo-dashboard");
  };

  return (
    <div className="ngo-login-wrapper">
      <div className="ngo-login-card">
        <h2>NGO Login</h2>

        <form onSubmit={handleLogin}>
          <div className="ngo-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="ngo-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>

          <p>
            Don’t have an account?
            <span onClick={() => navigate("/register-ngo")}>
              Register NGO
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default NgoLogin;