import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/login-register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (error) {
        alert(error.message);
        return;
      }

      // ⚠️ Important fix (handles both cases)
      const user = data.user || data.session?.user;

      if (!user) {
        alert("User created but session not found. Check email confirmation.");
        return;
      }

      // 📦 Insert extra user data in your table
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: user.id,
          name: name,
          email: email,
          role: "user",
        },
      ]);

      if (dbError) {
        console.error(dbError);
        alert("User created but profile not saved.");
        return;
      }

      alert("Registration successful 🎉");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">

        <div className="left-section">
          <h1>Join ServeShare</h1>
        </div>

        <div className="right-section">
          <div className="form-box">
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <p>
              Already have an account?
              <span onClick={() => navigate("/login")}> Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;