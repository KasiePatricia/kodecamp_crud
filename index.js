const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();
const { taskCollection } = require("./schema/taskSchema");

// import the routes
const taskRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");

// connect to database
const connect = mongoose.connect(process.env.mongoDBURL);

connect
  .then(() => {
    console.log("Connected to my database");
  })
  .catch((error) => {
    console.log("could not connect to database " + error);
  });

//  middleware
app.use(express.json());

app.use("/tasks", taskRoute);
app.use("/v1/auth", authRoute);

// listen to port
app.listen(port, () => {
  console.log("Listening on port " + port);
});
