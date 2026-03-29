export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};