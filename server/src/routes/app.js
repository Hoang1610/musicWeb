const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).json({
    sucess: "thanh cong",
  });
});
module.exports = router;
