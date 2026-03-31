import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const Ngos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ NEW

  const fetchNgos = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ngos")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false }); // ✅ NEW (latest first)

    if (error) {
      console.error(error);
    } else {
      setNgos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  return (
    <main className="dashboard-body">
      <h1>Registered NGOs</h1>

      {loading ? (
        <p>Loading NGOs...</p>
      ) : (
        <div className="table-wrapper">
          <table className="donation-table">
            <thead>
              <tr>
                <th>NGO Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {ngos.length === 0 ? (
                <tr>
                  <td colSpan="5">No NGOs Registered</td>
                </tr>
              ) : (
                ngos.map((ngo) => (
                  <tr key={ngo.id}>
                    <td>{ngo.name}</td>
                    <td>{ngo.category || "-"}</td>
                    <td>{ngo.city}, {ngo.state}</td>
                    <td>{ngo.phone || "-"}</td>
                    <td>{ngo.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Ngos;