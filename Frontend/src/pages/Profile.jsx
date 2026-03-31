import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import "../css/profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔐 GET LOGGED-IN USER
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) return;

      setUserId(currentUser.id);

      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (!error) {
        setUser(profile);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 💾 SAVE PROFILE
  const handleSave = async () => {
    try {
      let imageUrl = user.profile_image;

      // 📤 Upload image to Supabase Storage
      if (image) {
        const fileName = `${userId}_${Date.now()}`;

        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("profiles")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // 📦 Update user table
      const { error } = await supabase
        .from("users")
        .update({
          name: user.name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          pincode: user.pincode,
          profile_image: imageUrl,
        })
        .eq("id", userId);

      if (error) throw error;

      alert("Profile Updated!");

      setUser({ ...user, profile_image: imageUrl });
      setPreview(null);
      setIsEditing(false);

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        {/* LEFT */}
        <div className="profile-left">
          <img
            src={
              preview
                ? preview
                : user.profile_image ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="avatar"
            className="profile-img"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Full Name"
          />

          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Phone"
          />

          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Address"
          />

          <input
            name="city"
            value={user.city || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="City"
          />

          <input
            name="state"
            value={user.state || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="State"
          />

          <input
            name="pincode"
            value={user.pincode || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Pincode"
          />

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;