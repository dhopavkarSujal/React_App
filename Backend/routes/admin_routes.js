import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/role_middleware.js";

const router = express.Router();

// 🔹 Get All Users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT id, name, email, role FROM users"
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔹 Update User Role
router.put(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const { role } = req.body;

    try {
      await db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, req.params.id]
      );
      res.json({ message: "Role updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);



// Get Pending NGOs
router.get("/ngos/pending",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const [rows] = await db.query(
      "SELECT * FROM ngos WHERE verification_status = 'pending'"
    );
    res.json(rows);
  }
);

// Approve NGO
router.put("/ngos/approve/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    await db.query(
      "UPDATE ngos SET verification_status='approved' WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "NGO approved" });
  }
);

// Reject NGO
router.delete("/ngos/reject/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    await db.query(
      "DELETE FROM ngos WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "NGO rejected and deleted" });
  }
);

export default router;
