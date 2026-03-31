import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📦 FETCH USERS
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 CHANGE ROLE
  const changeRole = async (id, role) => {
    const confirm = window.confirm(`Change role to ${role}?`);
    if (!confirm) return;

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      // 🔥 Update UI instantly
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role } : user
        )
      );
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-container">
          <table className="donation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          changeRole(user.id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="ngo">NGO</option>
                        <option value="admin">Admin</option>
                      </select>
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

export default ManageUsers;