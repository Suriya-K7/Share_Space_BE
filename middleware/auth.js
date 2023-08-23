import jwt from "jsonwebtoken";
import { SECRET } from "../utils/config.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "" });
    }

    if (token.startsWith("bearer")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, SECRET);

    req.user = verified;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
