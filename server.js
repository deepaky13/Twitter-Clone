import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

import router from "./routes/authRouter.js";
import userRouter from "./routes/userrouter.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

app.use("/api/v1/auth", authenticateUser, router);
app.use("/api/v1/user", userRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`sever is ruuning on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
