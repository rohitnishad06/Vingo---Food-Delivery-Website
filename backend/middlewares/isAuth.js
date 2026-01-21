import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {

  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({ msg: "Token not found" });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeToken) {
      return res.status(400).json({ msg: "Token not Verify" });
    }

    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ msg: `isAuth Error ${error}` });
  }
};

export default isAuth;