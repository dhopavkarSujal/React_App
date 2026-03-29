import db from "../config/db.js";
import bcrypt from "bcryptjs";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );

    res.json({ message: "User registered successfully" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Save session
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};

// NGO LOGIN
export const ngoLogin = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM ngos WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const ngo = rows[0];

  const match = bcrypt.compareSync(password, ngo.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (ngo.verification_status !== "approved") {
    return res.status(403).json({
      message: "NGO not approved yet"
    });
  }

  req.session.userId = ngo.id;
  req.session.userRole = "ngo";

  res.json({
    user: {
      id: ngo.id,
      role: "ngo",
      name: ngo.ngo_name
    }
  });
};

// NGO Registration
export const registerNgo = async (req, res) => {
  const {
    ngo_name,
    email,
    password,
    registration_number,
    established_year,
    city,
    state,
    pincode,
    donation_type,
    service_radius_km,
    contact,
    summary
  } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.query(
      `INSERT INTO ngos
      (ngo_name, email, password, registration_number, established_year,
       city, state, pincode, donation_type, service_radius_km,
       contact, summary, verification_status, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'ngo')`,
      [
        ngo_name,
        email,
        hashedPassword,
        registration_number || null,
        established_year || null,
        city || null,
        state || null,
        pincode || null,
        donation_type || null,
        service_radius_km || null,
        contact || null,
        summary || null
      ]
    );

    res.json({ message: "NGO registered successfully" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};