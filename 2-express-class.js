// online connection of mongodb
// mongodb+srv://ugwukasiep:<password>@cluster0.8kmclo4.mongodb.net/kodecamp_crud

// offline connection of mongodb
// mongodb://localhost:27017/kodecamp_crud

const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();
const { taskCollection } = require("./schema/taskSchema");

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

//  routes
app.get("/", async (req, res) => {
  const task = await taskCollection.find();
  res.json(task);
});

app.post("/hello", async (req, res) => {
  const newTask = await taskCollection.create({
    taskTitle: req.body.taskTitle,
    taskBody: req.body.taskBody,
  });
  res.json({ isRequestSuccessful: true, newTask });
});

app.get("/by-id/:id", async (req, res) => {
  const task = await taskCollection.findById(req.params.id);
  res.send(task);
});

app.get("/by-task-title/:title", async (req, res) => {
  const task = await taskCollection.findOne({ taskTitle: req.params.title });

  if (!task) return res.status(400).send("not-found");

  res.send(task);
});

app.patch("/:id", async (req, res) => {
  const updatedTask = await taskCollection.findByIdAndUpdate(
    req.params.id,
    {
      taskBody: req.body.taskBody,
    },
    { new: true }
  );

  res.json({ message: "Task updated", updatedTask });
});

app.delete("/:id", async (req, res) => {
  await taskCollection.findByIdAndDelete(req.params.id);
  res.send("Task deleted");
});

// listen to port
app.listen(port, () => {
  console.log("Listening on port " + port);
});
