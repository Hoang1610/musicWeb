const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkToken = (req, res, next) => {
  if (req?.headers?.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "unAuthorized",
      });
    }
  } else {
    return res.status(401).json({
      message: "unAuthorized",
    });
  }
};
module.exports = { checkToken };
