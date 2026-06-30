import express from "express";
import authRouter from "./routes/auth.routes";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
