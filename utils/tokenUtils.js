import jwt from "jsonwebtoken";


export const createJwt = (userId, res) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  console.log("Token expires in:", expiresIn);

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  res.cookie("jwt", token, {
    maxAge: 15*24 * 60 * 60 * 1000,
    httpOnly: true,
    // sameSite: "strict",
    // secure: process.env.NODE_ENV !== "develop",
  });
};

export const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      complete: true,
    });
    console.log("decoded token", decoded);

    return decoded;
  } catch (error) {
    console.log("Token verification error:", error);
    throw error;
  }
};
