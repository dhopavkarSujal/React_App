import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";

function NgoDashboard() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // 🔐 CHECK NGO AUTH
  useEffect(() => {
    const checkNgo = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      // 📦 Get user profile
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (!profile || profile.role !== "ngo") {
        navigate("/login");
        return;
      }

      setUser(profile);

      // 📦 FETCH APPROVED DONATIONS
      const { data: approvedDonations } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "approved");

      setDonations(approvedDonations || []);
    };

    checkNgo();
  }, [navigate]);

  // 🎯 CLAIM DONATION
  const handleClaim = async (id) => {
    const confirm = window.confirm("Claim this donation?");
    if (!confirm) return;

    const { error } = await supabase
      .from("donations")
      .update({ status: "claimed" })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      alert("Donation claimed successfully!");

      // 🔄 Remove from list
      setDonations(donations.filter((d) => d.id !== id));
    }
  };

  return (
    <DashboardLayout user={user}>
      <h2>NGO Dashboard</h2>

      {donations.length === 0 ? (
        <p>No available donations</p>
      ) : (
        donations.map((donation) => (
          <div key={donation.id} className="donation-card">
            <h4>{donation.donation_type}</h4>
            <p>{donation.description}</p>

            <button onClick={() => handleClaim(donation.id)}>
              Claim
            </button>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default NgoDashboard;