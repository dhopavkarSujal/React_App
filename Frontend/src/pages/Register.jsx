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

      const user = data.user || data.session?.user;

      if (!user) {
        alert("Check your email for confirmation.");
        return;
      }

      // 📦 Insert into users table
      const { error: dbError } = await supabase
        .from("users")
        .insert([
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

    } catch (error) {
      console.error(error);
      alert("Registration failed");
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
            <h1>Join ServeShare</h1>
            <p>Create your account and start helping people today!</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="form-box">
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?
                <span onClick={() => navigate("/login")}>
                  {" "}Login
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;