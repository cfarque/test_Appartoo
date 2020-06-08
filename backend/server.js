require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userRoutes = require("./Routes/user.js");
app.use(userRoutes);

app.all("*", (req, res) => {
  res.json({ message: "page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
