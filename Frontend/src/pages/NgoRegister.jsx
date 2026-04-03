import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/ngoRegister.css";

function NgoRegister() {
  const navigate = useNavigate();

  // ✅ Only required fields
  const [form, setForm] = useState({
    ngo_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const user = data.user || data.session?.user;

      if (!user) {
        alert("Check your email for confirmation.");
        setLoading(false);
        return;
      }

      // ✅ Insert minimal NGO data
      const { error: ngoError } = await supabase
        .from("ngos")
        .insert([
          {
            id: user.id,
            name: form.ngo_name,
            email: form.email,
            status: "incomplete",
          },
        ]);

      if (ngoError) {
        console.error(ngoError);
        alert("NGO data not saved");
        setLoading(false);
        return;
      }

      // ✅ Insert role in users table
      await supabase.from("users").insert([
        {
          id: user.id,
          name: form.ngo_name,
          email: form.email,
          role: "ngo",
        },
      ]);

      alert("NGO Registered Successfully. Please login to complete profile.");
      navigate("/ngo-login");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
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

      <div className="ngo-register-wrapper">
        <div className="ngo-register-container">
          {/* Header Section */}
          <div className="ngo-header">
            <h1>ServeShare</h1>
            <p>NGO Registration Portal</p>
          </div>

          {/* Form Card */}
          <div className="ngo-register-card">
            <div className="ngo-form-box">
              <h2>NGO Registration</h2>

              <form onSubmit={handleSubmit}>
                <div className="ngo-form-grid">

                  {/* NGO Name */}
                  <div className="ngo-field">
                    <input 
                      name="ngo_name" 
                      placeholder=" " 
                      value={form.ngo_name}
                      onChange={handleChange} 
                      required 
                    />
                    <label>NGO Name</label>
                  </div>

                  {/* Email */}
                  <div className="ngo-field">
                    <input 
                      type="email" 
                      name="email" 
                      placeholder=" " 
                      value={form.email}
                      onChange={handleChange} 
                      required 
                    />
                    <label>Email Address</label>
                  </div>

                  {/* Password */}
                  <div className="ngo-field">
                    <input 
                      type="password" 
                      name="password" 
                      placeholder=" " 
                      value={form.password}
                      onChange={handleChange} 
                      required 
                    />
                    <label>Password</label>
                  </div>

                  {/* Button */}
                  <button 
                    className="ngo-btn" 
                    type="submit" 
                    disabled={loading}
                    style={{ gridColumn: "span 1" }}
                  >
                    {loading ? "Registering..." : "Register NGO"}
                  </button>

                </div>
              </form>

              <div className="ngo-footer">
                Already registered?
                <span onClick={() => navigate("/ngo-login")}>
                  NGO Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NgoRegister;