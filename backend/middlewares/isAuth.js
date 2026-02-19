import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token not found" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeToken) {
      return res.status(401).json({ msg: "Token not verified" });
    }

    req.userId = decodeToken.userId;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or Expired Token" });
  }
};

export default isAuth;
