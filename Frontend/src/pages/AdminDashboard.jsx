import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import ManageUsers from "./ManageUsers";
import ManageNgos from "./ManageNgos";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("donations");

  const navigate = useNavigate();

  // 🔐 CHECK ADMIN AUTH
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      // 📦 Get user role
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (!profile || profile.role !== "admin") {
        navigate("/login");
        return;
      }

      setUser(profile);

      // 📦 Fetch pending donations
      const { data: pending } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      setDonations(pending || []);
    };

    checkAdmin();
  }, [navigate]);

  // ✅ APPROVE
  const handleApprove = async (id) => {
    const confirm = window.confirm("Approve this donation?");
    if (!confirm) return;

    const { error } = await supabase
      .from("donations")
      .update({ status: "approved" })
      .eq("id", id);

    if (!error) {
      setDonations(donations.filter((d) => d.id !== id));
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    const confirm = window.confirm("Reject this donation?");
    if (!confirm) return;

    const { error } = await supabase
      .from("donations")
      .update({ status: "rejected" })
      .eq("id", id);

    if (!error) {
      setDonations(donations.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="dashboard-container">

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-content">
        <AdminHeader user={user} />

        <div className="dashboard-body">

          {/* 📦 DONATIONS */}
          {activePage === "donations" && (
            <>
              <h2>Pending Donations</h2>

              {donations.length === 0 ? (
                <p>No pending donations.</p>
              ) : (
                <div className="table-container">
                  <table className="donation-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Expiry</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation.id}>
                          <td>{donation.id}</td>
                          <td>{donation.description}</td>
                          <td>{donation.donation_type}</td>
                          <td>{donation.quantity || "-"}</td>
                          <td>
                            {donation.amount ? `₹${donation.amount}` : "-"}
                          </td>
                          <td>{donation.expiry_date || "-"}</td>

                          <td>
                            <button
                              className="approve-btn"
                              onClick={() => handleApprove(donation.id)}
                            >
                              Accept
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => handleReject(donation.id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}
            </>
          )}

          {/* 👤 USERS */}
          {activePage === "users" && <ManageUsers />}

          {/* 🏢 NGOS */}
          {activePage === "ngos" && <ManageNgos />}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;