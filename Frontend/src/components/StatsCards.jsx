import { FaBox, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function StatsCards({ donations = [] }) {

  // ✅ Safe fallback
  const total = donations.length;

  const pending = donations.filter(
    (d) => d.status === "pending"
  ).length;

  const approved = donations.filter(
    (d) => d.status === "approved"
  ).length;

  const rejected = donations.filter(
    (d) => d.status === "rejected"
  ).length;

  return (
    <div className="stats-container">

      <div className="card total">
        <div className="icon"><FaBox /></div>
        <span className="number">{total}</span>
        <span className="label">Total Donations</span>
      </div>

      <div className="card pending">
        <div className="icon"><FaClock /></div>
        <span className="number">{pending}</span>
        <span className="label">Pending</span>
      </div>

      <div className="card approved">
        <div className="icon"><FaCheckCircle /></div>
        <span className="number">{approved}</span>
        <span className="label">Approved</span>
      </div>

      <div className="card rejected">
        <div className="icon"><FaTimesCircle /></div>
        <span className="number">{rejected}</span>
        <span className="label">Rejected</span>
      </div>

    </div>
  );
}

export default StatsCards;