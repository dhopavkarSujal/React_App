import { useEffect, useState } from "react";

function ManageNgos() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    fetch("http://localhost:5000/api/admin/ngos/pending", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setNgos(data));
  };

  const approveNgo = (id) => {
    fetch(`http://localhost:5000/api/admin/ngos/approve/${id}`, {
      method: "PUT",
      credentials: "include",
    }).then(() => {
      fetchPending();
    });
  };

  const rejectNgo = (id) => {
    fetch(`http://localhost:5000/api/admin/ngos/reject/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      fetchPending();
    });
  };

  return (
    <div>
      <h2>Pending NGO Approvals</h2>

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
            {ngos.map((ngo) => (
              <tr key={ngo.id}>
                <td>{ngo.id}</td>
                <td>{ngo.ngo_name}</td>
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
            ))}

            {ngos.length === 0 && (
              <tr>
                <td colSpan="5">No pending NGOs</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageNgos;