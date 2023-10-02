const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/" });
const { taskCollection } = require("../schema/taskSchema");
const { isUserLoggedin } = require("../middlewares/middleware");
router.use(isUserLoggedin);

router.post("/pic", upload.single("file"), async (req, res) => {
  const { taskTitle, taskBody } = req.body;
  const { filename } = req.file;

  const newTask = await taskCollection.create({
    taskBody,
    taskTitle,
    pictureName: filename,
  });

  res.send({ successful: true, newTask });
});

module.exports = router;
