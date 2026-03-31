import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../css/ngoRegister.css";

function NgoRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ngo_name: "",
    email: "",
    password: "",
    registration_number: "",
    established_year: "",
    city: "",
    state: "",
    pincode: "",
    donation_type: "",
    service_radius_km: "",
    contact: "",
    summary: ""
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
        return;
      }

      const user = data.user || data.session?.user;

      if (!user) {
        alert("Check your email for confirmation.");
        return;
      }

      // 📦 Insert NGO data into ngos table
      const { error: ngoError } = await supabase
        .from("ngos")
        .insert([
          {
            id: user.id,
            name: form.ngo_name,
            email: form.email,
            registration_number: form.registration_number,
            established_year: form.established_year,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            category: form.donation_type,
            service_radius_km: form.service_radius_km,
            phone: form.contact,
            description: form.summary,
            status: "pending",
          },
        ]);

      if (ngoError) {
        console.error(ngoError);
        alert("NGO data not saved");
        return;
      }

      // 📦 Insert role in users table
      await supabase.from("users").insert([
        {
          id: user.id,
          name: form.ngo_name,
          email: form.email,
          role: "ngo",
        },
      ]);

      alert("NGO Registered Successfully. Waiting for approval.");
      navigate("/ngo-login");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="authcontainer">
        <div className="ngo-form-box">
          <h2>NGO Registration</h2>

          <form onSubmit={handleSubmit}>
            <input name="ngo_name" placeholder="NGO Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

            <input name="registration_number" placeholder="Registration Number" onChange={handleChange} />
            <input name="established_year" placeholder="Established Year" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="state" placeholder="State" onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
            <input name="donation_type" placeholder="Donation Types" onChange={handleChange} />
            <input name="service_radius_km" placeholder="Service Radius (KM)" onChange={handleChange} />
            <input name="contact" placeholder="Phone" onChange={handleChange} />
            <textarea name="summary" placeholder="About NGO" onChange={handleChange} />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register NGO"}
            </button>

            <p>
              Already registered?
              <button type="button" onClick={() => navigate("/ngo-login")}>
                NGO Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NgoRegister;