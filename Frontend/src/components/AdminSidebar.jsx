import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const AdminSidebar = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    setActivePage(page);
  };

  // 🔐 SUPABASE LOGOUT
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>ServeShare</h2>

      <ul>
        {/* Dashboard */}
        <li>
          <button
            className={`sidebar-link ${activePage === "donations" ? "active" : ""}`}
            onClick={() => handleClick("donations")}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </button>
        </li>

        {/* Manage Users */}
        <li>
          <button
            className={`sidebar-link ${activePage === "users" ? "active" : ""}`}
            onClick={() => handleClick("users")}
          >
            <i className="fas fa-users"></i>
            Manage Users
          </button>
        </li>

        {/* Manage NGOs */}
        <li>
          <button
            className={`sidebar-link ${activePage === "ngos" ? "active" : ""}`}
            onClick={() => handleClick("ngos")}
          >
            <i className="fas fa-building"></i>
            Manage NGOs
          </button>
        </li>
      </ul>

      <button className="logout sidebar-link" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;