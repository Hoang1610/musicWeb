const express = require("express");
const {
  getUserApi,
  getInfoApi,
  getReleaseChartApi,
  getSongInfoApi,
  getSongApi,
  getListSongArtistApi,
  getDetailPlayListApi,
  getChartHomeApi,
  getNewReleaseChartApi,
  getSearchSongApi,
  getArtistApi,
  getLyricApi,
  getTopApi,
  chat,
} = require("../controller/apiController");
const {
  postUsers,
  getApiUser,
  loginUser,
  getSongLike,
} = require("../controller/useController");
const { checkToken } = require("../middlewares/middleWares");
const router = express.Router();
router.get("/user", getUserApi);
router.get("/home", getInfoApi);
router.get("/newReleaseChart", getReleaseChartApi);
router.get("/songInfo", getSongInfoApi);
router.get("/song", getSongApi);
router.get("/listSongArtist", getListSongArtistApi);
router.get("/detailPlayList", getDetailPlayListApi);
router.get("/chartHome", getChartHomeApi);
router.get("/searchSong", getSearchSongApi);
router.get("/artist", getArtistApi);
router.get("/lyric", getLyricApi);
router.get("/top100", getTopApi);
router.post("/register", postUsers);
router.get("/getUser", getApiUser);
router.post("/login", loginUser);
router.get("/SongLike", checkToken, getSongLike);
router.post("/chat", chat);
module.exports = router;
