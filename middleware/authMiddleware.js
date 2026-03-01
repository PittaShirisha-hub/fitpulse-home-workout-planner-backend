export const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  // For now just allow (later you can verify JWT)
  next();
};