import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "User not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    res.status(200).json({ user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
