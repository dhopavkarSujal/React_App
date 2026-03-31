import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import "../css/addDonationModal.css";

const AddDonationModal = ({ onClose }) => {
  const [donationType, setDonationType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ NEW

    // ✅ VALIDATION
    if (!donationType) {
      setLoading(false);
      return setError("Please select donation type.");
    }

    if (donationType === "Food") {
      if (!quantity || !expiryDate) {
        setLoading(false);
        return setError("Food quantity and expiry date required.");
      }

      const today = new Date().toISOString().split("T")[0];
      if (expiryDate <= today) {
        setLoading(false);
        return setError("Food expiry must be future date.");
      }
    }

    if (donationType === "Funds" && !amount) {
      setLoading(false);
      return setError("Amount is required.");
    }

    if (!description.trim()) {
      setLoading(false);
      return setError("Description is required.");
    }

    const confirmSubmit = window.confirm(
      `Confirm Donation?\n\nType: ${donationType}\nDescription: ${description}`
    );

    if (!confirmSubmit) {
      setLoading(false);
      return;
    }

    try {
      // 🔐 Get logged-in user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setLoading(false);
        return setError("User not logged in");
      }

      // ✅ INSERT INTO SUPABASE
      const { error: insertError } = await supabase
        .from("donations")
        .insert([
          {
            user_id: user.id,
            donation_type: donationType,
            quantity: quantity || null,
            amount: amount || null,
            description,
            expiry_date: expiryDate || null,
            status: "pending",
          },
        ]);

      if (insertError) throw insertError;

      alert("Donation submitted successfully! 🎉");

      // 🔄 RESET FORM
      setDonationType("");
      setQuantity("");
      setAmount("");
      setDescription("");
      setExpiryDate("");

      onClose();

    } catch (err) {
      console.error(err); // ✅ NEW
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ NEW
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        <h2 className="modal-title">Add Donation</h2>
        <p className="modal-subtitle">
          Select type and fill required details
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Donation Type</label>
            <select
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books & Stationery</option>
              <option value="Funds">Funds</option>
            </select>
          </div>

          {donationType === "Food" && (
            <>
              <div className="form-group">
                <label>Food Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Eg: 10 meals"
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </>
          )}

          {donationType === "Funds" && (
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short note..."
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Donation"} {/* ✅ NEW */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDonationModal;