import { UnauthenticatedError } from "../error/customError.js";
import { verifyJwt } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) throw new UnauthenticatedError("authentication invalid");

  try {
    const { userId } = verifyJwt(token);
    req.user = userId;
    next();
  } catch (error) {
    console.log("Error in authenication", error);
    throw new UnauthenticatedError("Authentication error");
  }
};
