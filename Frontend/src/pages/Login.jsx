import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/login-register.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Auto login if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Supabase login (same logic as your backend)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });

      if (error) {
        alert(error.message || "Login failed");
        return;
      }

      const user = data.user;

      // 📦 Fetch role from database (same as backend role logic)
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Role not found, default user");
      }

      const role = profile?.role;

      // 🔥 SAME REDIRECT LOGIC (unchanged)
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "ngo") {
        navigate("/ngo-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        {/* LEFT */}
        <div className="left-section">
          <div>
            <h1>Welcome Back!</h1>
            <p>Login to continue donating and helping those in need.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="form-box">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?
                <span onClick={() => navigate("/register")}>
                  {" "}Register here
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;