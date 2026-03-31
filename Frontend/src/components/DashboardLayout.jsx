import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ user, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]); // ✅ NEW

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔔 FETCH REAL NOTIFICATIONS (Supabase)
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user;

      if (!currentUser) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id);

      setNotifications(data || []);
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <Sidebar
        activePage=""
        setActivePage={() => {}}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <Header
        username={user?.name}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        toggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        openNotifications={() => alert("Show notifications")} // you can connect modal later
        notifCount={notifications.length} // ✅ REAL DATA
      />

      <main className="dashboard-body">
        {children}
      </main>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardLayout;