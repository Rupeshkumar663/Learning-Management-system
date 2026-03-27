import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId; // FIX ✔

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;
