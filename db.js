import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (e) => console.log(`Error on DB Connection: ${e}`);

db.on("error", handleError);
db.once("open", handleOpen);
