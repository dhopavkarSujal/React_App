import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/ngoLogin.css";

function NgoLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
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
    <>
      <header className="top-navbar">
        <div className="nav-inner">
          <div className="logo">
            <img src="img/logo1.png" alt="ServeShare" />
          </div>
        </div>
      </header>

      <div className="ngo-login-wrapper">
        <div className="ngo-login-container">
          {/* Header Section */}
          <div className="ngo-header">
            <h1>ServeShare</h1>
            <p>NGO Login Portal</p>
          </div>

          {/* Form Card */}
          <div className="ngo-login-card">
            <div className="ngo-form-box">
              <h2>NGO Login</h2>

              <form onSubmit={handleLogin}>
                <div className="ngo-field">
                  <input
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label>Email Address</label>
                </div>

                <div className="ngo-field">
                  <input
                    type="password"
                    placeholder=" "
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>

                <button className="ngo-btn" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="ngo-footer">
                Don't have an account?
                <span onClick={() => navigate("/register-ngo")}>
                  Register NGO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NgoLogin;