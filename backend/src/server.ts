const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const loggedin = require("./routes/loggedin");
const tasks = require("./routes/tasks");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("Connected to db"))
  .catch((error: any) => console.log(error));

app.use("/auth", authRoutes);
app.use("/protected", loggedin);
app.use("/tasks", tasks);

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
