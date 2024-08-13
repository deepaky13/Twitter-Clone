import { UnauthenticatedError } from "../error/customError.js";
import { verifyJwt } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Received token:", token);

  if (!token) throw new UnauthenticatedError("Authentication invalid");

  try {
    const decodedToken = verifyJwt(token);
    console.log("Decoded Token:", decodedToken);
    req.user = decodedToken.userId;
    next();
  } catch (error) {
    console.log("Error in authentication", error);
    if (error.name === "TokenExpiredError") {
      console.log("Token expired at:", error.expiredAt);
    }
    throw new UnauthenticatedError("Authentication error");
  }
};
