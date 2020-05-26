import "./db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const handleListening = () =>
  console.log(`Listening at http://localhost:${PORT}`);

app.listen(PORT, handleListening);
