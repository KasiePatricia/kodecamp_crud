const express = require("express");
const port = process.env.PORT || 3003;
const app = express();

app.use((req, res, next) => {
  console.log(req.method);
  next();
});

app.use(express.json());

app.post("/login", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.get("/user/:username", (req, res) => {
  console.log(req.params.username);
  res.send("hello " + req.params.username);
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
