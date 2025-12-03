const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const postUsers = async (req, res) => {
  const { email, pass, name } = req.body;
  const hashPassWord = await bcrypt.hash(pass, saltRounds);
  try {
    const data = await User.create({
      email,
      pass: hashPassWord,
      name,
    });
    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
const getApiUser = async (req, res) => {
  const data = await User.find();
  return res.status(200).json({
    data,
  });
};
const loginUser = async (req, res) => {
  const { email, pass } = req.body;
  const data = await User.findOne({ email }).exec();
  if (data) {
    const isMatchPass = await bcrypt.compare(pass, data.pass);
    if (isMatchPass) {
      const payload = {
        email,
        name: data.name,
        songLike: data.songLike,
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      return res.status(200).json({
        accessToken,
        user: payload,
      });
    } else {
      return res.status(200).json({
        data: "email/pass không đúng",
      });
    }
  } else {
    return res.status(200).json({
      data: "email/pass không đúng",
    });
  }
};
const getSongLike = async (req, res) => {
  const decoded = req.decoded;
  console.log(decoded);
  return res.status(200).json({
    data: "thanh cong",
  });
};
module.exports = { postUsers, getApiUser, loginUser, getSongLike };
