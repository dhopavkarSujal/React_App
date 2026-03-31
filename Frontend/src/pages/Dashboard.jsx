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

  // 🔐 CHECK USER SESSION
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
  const fetchDonations = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("user_id", userId);

    if (!error) {
      setDonations(data);
    }
  };

  // 🔔 FETCH NOTIFICATIONS
  const fetchNotifications = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId);

    if (!error) {
      setNotifications(data);
    }
  };

  // 🔁 LOAD DATA AFTER USER
  useEffect(() => {
    if (user?.id) {
      fetchDonations(user.id);
      fetchNotifications(user.id);

      const interval = setInterval(() => {
        fetchNotifications(user.id);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 📱 SIDEBAR
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  // 👉 SWIPE SIDEBAR
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX < 50 && endX > 120) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // 📄 PAGE SWITCH
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
            fetchDonations(user?.id);
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