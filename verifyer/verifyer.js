const jwt = require("jsonwebtoken");

const usersVerifyer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("Access denied");

  try {
    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifyed;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const employersVerifyer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("Access denied");

  try {
    const verifyed = jwt.verify(token, process.env.TOKEN_SECRET_E);
    req.employer = verifyed;
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  usersVerifyer,
  employersVerifyer,
};
