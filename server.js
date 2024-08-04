import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

import router from "./routes/authRouter.js";

app.use("/api/v1/auth", router);

const port = process.env.PORT || 4000;
try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`sever is ruuning on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
