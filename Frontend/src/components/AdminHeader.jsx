import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const AdminHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }

    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div>
        <h3>Welcome, {user?.name || "Admin"}</h3>
        <p>Admin Panel</p>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;