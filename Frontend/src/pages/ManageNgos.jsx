import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

function ManageNgos() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ NEW

  // 📦 FETCH PENDING NGOS
  const fetchPending = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ngos")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }); // ✅ NEW (latest first)

    if (error) {
      console.error(error);
    } else {
      setNgos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ✅ APPROVE NGO
  const approveNgo = async (id) => {
    const confirm = window.confirm("Approve this NGO?");
    if (!confirm) return;

    const { error } = await supabase
      .from("ngos")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      fetchPending(); // refresh list
    }
  };

  // ❌ REJECT NGO
  const rejectNgo = async (id) => {
    const confirm = window.confirm("Reject this NGO?");
    if (!confirm) return;

    const { error } = await supabase
      .from("ngos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      fetchPending(); // refresh list
    }
  };

  return (
    <div>
      <h2>Pending NGO Approvals</h2>

      {loading ? (
        <p>Loading NGOs...</p>
      ) : (
        <div className="table-container">
          <table className="donation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NGO Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {ngos.length === 0 ? (
                <tr>
                  <td colSpan="5">No pending NGOs</td>
                </tr>
              ) : (
                ngos.map((ngo) => (
                  <tr key={ngo.id}>
                    <td>{ngo.id}</td>
                    <td>{ngo.name}</td>
                    <td>{ngo.email}</td>
                    <td>{ngo.city}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => approveNgo(ngo.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectNgo(ngo.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default ManageNgos;