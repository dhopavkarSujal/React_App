import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const Donations = () => {
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    // 🔐 Get logged-in user
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      console.log("No user found");
      return;
    }

    // 📦 Fetch user donations
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }); // 🔥 newest first

    if (error) {
      console.error(error);
    } else {
      setDonations(data || []);
    }
  };

  useEffect(() => {
    fetchDonations();

    // 🔄 OPTIONAL: Auto refresh every 5 sec
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="donations-section">
      <h2>My Donations</h2>

      <div className="table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Donation Type</th>
              <th>Quantity</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="6">No donations found</td>
              </tr>
            ) : (
              donations.map((donation, index) => (
                <tr key={donation.id}>
                  <td>{index + 1}</td>
                  <td>{donation.donation_type}</td>
                  <td>{donation.quantity || "—"}</td>
                  <td>{donation.amount || "—"}</td>
                  <td>{donation.description}</td>
                  <td>
                    <span className={`status ${donation.status}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Donations;