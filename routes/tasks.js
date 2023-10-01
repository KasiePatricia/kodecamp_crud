const express = require("express");
const { taskCollection } = require("../schema/taskSchema");
const route = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = require("./auth");
const { isUserLoggedin, adminsOnly } = require("../middlewares/middleware");

const secret = process.env.secret;

route.use(isUserLoggedin);

//  routes
route.get("/", async (req, res) => {
  const task = await taskCollection.find({ user: req.decoded.userId });
  res.json(task);
});

route.post("/", async (req, res) => {
  const { taskTitle, taskBody } = req.body;
  const { userId } = req.decoded;
  try {
    const newTask = await taskCollection.create({
      taskTitle,
      taskBody,
      user: userId,
    });
    res.json({ isRequestSuccessful: true, newTask });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal-server-error");
  }
});

route.get("/by-id/:id", async (req, res) => {
  const task = await taskCollection.findById(req.params.id);
  res.send(task);
});

route.get("/by-task-title/:title", async (req, res) => {
  const task = await taskCollection.findOne({ taskTitle: req.params.title });

  if (!task) return res.status(400).send("not-found");

  res.send(task);
});

route.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTask = await taskCollection.findByIdAndUpdate(
    id,
    {
      taskBody: req.body.taskBody,
    },
    { new: true }
  );

  res.json({ message: "Task updated", updatedTask });
});

route.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const note = await taskCollection.findById(id);
  if (req.decoded.userId != note.user) {
    res.status(401).send("You are not allowed to delete this task");
    return;
  }
  await taskCollection.findByIdAndDelete(id);
  res.send("Task deleted");
});

route.get("/admin/all-tasks", adminsOnly, async (req, res) => {
  const task = await taskCollection.find();
  res.send(task);
});

module.exports = route;
