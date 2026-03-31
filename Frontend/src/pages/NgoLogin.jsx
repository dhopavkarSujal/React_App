import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/ngoLogin.css";

function NgoLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔄 Auto redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/ngo-dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      // 📦 Check role in DB
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "ngo") {
        alert("Access denied: Not an NGO account");
        return;
      }

      // ✅ Redirect
      navigate("/ngo-dashboard");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

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