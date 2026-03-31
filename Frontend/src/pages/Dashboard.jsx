import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import DonationsPage from "../pages/Donations";
import RecentDonations from "../components/RecentDonations";
import NotificationModal from "../components/NotificationModal";
import Ngos from "./Ngos";
import AddDonationModal from "../components/AddDonationModal";
import Profile from "./Profile";

import "../css/dashboard.css";
import "../css/profile.css";

const DashboardHome = ({ donations }) => (
  <>
    <StatsCards donations={donations} />
    <RecentDonations donations={donations} />
  </>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setUser(profile);
    };

    checkUser();
  }, [navigate]);

  // 📦 FETCH DONATIONS
  const fetchDonations = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData.session?.user;

    if (!currentUser) return;

    const { data } = await supabase
      .from("donations")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    setDonations(data || []);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // 🔔 FETCH NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user;

      if (!currentUser) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    };

    fetchNotifications();
  }, []);

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 📱 SIDEBAR CLASS
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  // 👉 PAGE SWITCH
  const renderPage = () => {
    switch (activePage) {
      case "donations":
        return <DonationsPage />;
      case "ngos":
        return <Ngos />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardHome donations={donations} />;
    }
  };

  return (
    <>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <Header
        username={user?.name}
        onAddDonation={() => setShowModal(true)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        toggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        openNotifications={() => setShowNotif(true)}
        notifCount={notifications.length}
      />

      <main className="dashboard-body">
        {renderPage()}
      </main>

      {/* ➕ ADD DONATION */}
      {showModal && (
        <AddDonationModal
          onClose={() => {
            setShowModal(false);
            fetchDonations(); // ✅ FIXED
          }}
        />
      )}

      {/* 🔔 NOTIFICATIONS */}
      {showNotif && (
        <NotificationModal
          onClose={() => setShowNotif(false)}
          notifications={notifications}
        />
      )}

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

export default Dashboard;