const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.secret;

function isUserLoggedin(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).send("no-authorization-header");
    return;
  }

  const val = authorizationHeader.split(" ");

  const tokenType = val[0];

  const tokenValue = val[1];

  if (tokenType == "Bearer") {
    const decoded = jwt.verify(tokenValue, secret);
    // console.log(decoded);
    req.decoded = decoded;
    next();
    return;
  }
  res.status(401).send("not-authorizeed");
}

function adminsOnly(req, res, next) {
  if (req.decoded.role == "admin") {
    next();
  } else {
    res.status(401).send("You're not an admin");
  }
}

module.exports = { isUserLoggedin, adminsOnly };
