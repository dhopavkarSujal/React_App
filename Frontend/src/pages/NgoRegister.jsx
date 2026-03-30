import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register-ngo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("NGO Registered Successfully. Waiting for approval.");
    navigate("/login");
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

<button type="submit">Register NGO</button>
            <p>
                Are you an NGO?
                <button onClick={() => navigate("/ngo-login")}>
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