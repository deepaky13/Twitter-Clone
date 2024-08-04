import jwt from "jsonwebtoken";

export const createJwt = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent Xss attacks cross site scripting attacks
    sameSite: "strict", // CRFS protection
    secure: process.env.NODE_ENV !== "develop",
  });
};

export const verifyJwt = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
