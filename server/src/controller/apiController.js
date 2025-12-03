const User = require("../models/user");
const { ZingMp3 } = require("zingmp3-api-full-v3");
const { GoogleGenAI } = require("@google/genai");

// Khởi tạo client. Nó sẽ tự động tìm GEMINI_API_KEY trong biến môi trường.
const ai = new GoogleGenAI({});

const getUserApi = async (req, res) => {
  let users = await User.find({});
  return res.status(200).json({
    errorCode: 0,
    data: users,
  });
};
const getInfoApi = async (req, res) => {
  const data = await ZingMp3.getHome();
  return res.status(200).json({
    data,
  });
};
const getReleaseChartApi = async (req, res) => {
  const data = await ZingMp3.getNewReleaseChart();
  return res.status(200).json({
    data,
  });
};
const getSongInfoApi = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing id",
    });
  }
  const data = await ZingMp3.getInfoSong(id);
  return res.status(200).json({
    data,
  });
};
const getSongApi = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing id",
    });
  }
  const data = await ZingMp3.getSong(id);
  return res.status(200).json({
    data,
  });
};
const getListSongArtistApi = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing id",
    });
  }
  const data = await ZingMp3.getListArtistSong(id, "1", "15");
  return res.status(200).json({
    data,
  });
};
const getDetailPlayListApi = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing id",
    });
  }
  const data = await ZingMp3.getDetailPlaylist(id);
  return res.status(200).json({
    data,
  });
};
const getChartHomeApi = async (req, res) => {
  const data = await ZingMp3.getChartHome();
  return res.status(200).json({
    data,
  });
};
const getNewReleaseChartApi = async (req, res) => {
  const data = await ZingMp3.getNewReleaseChart();
  return res.status(200).json({
    data,
  });
};
const getSearchSongApi = async (req, res) => {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing key",
    });
  }
  const data = await ZingMp3.search(key);
  return res.status(200).json({
    data,
  });
};
const getArtistApi = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing key",
    });
  }
  const data = await ZingMp3.getArtist(name);
  return res.status(200).json({
    data,
  });
};
const getLyricApi = async (req, res) => {
  const { idSong } = req.query;
  if (!idSong) {
    return res.status(400).json({
      errorCode: 1,
      message: "Missing key",
    });
  }
  const data = await ZingMp3.getLyric(idSong);
  return res.status(200).json({
    data,
  });
};
const getTopApi = async (req, res) => {
  const data = await ZingMp3.getTop100();
  return res.status(200).json({
    data,
  });
};
const chat = async (req, res) => {
  const { message } = req.body;
  try {
    const prompt = `Bạn là một trợ lý thông minh chuyên hỗ trợ người dùng trong việc đề cử bài hát có trong zingmp3.
    Người dùng gửi lên ${message}
    Hãy trả về 2 bài hát phù hợp với yêu cầu người dùng. Dữ liệu trả về là một json có dạng:
    [
    {"nameSong":"..."},
    {"nameSong":"..."},
    ]
    chỉ trả về dạng array như trên, không thêm giải thích hay định dạng markdown nào.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const songArray = JSON.parse(response.text);
    const songCurrent1 = await ZingMp3.search(songArray[0].nameSong);
    const songCurrent2 = await ZingMp3.search(songArray[1].nameSong);
    return res.status(200).json({
      data: [songCurrent1.data.songs[0], songCurrent2.data.songs[0]],
    });
  } catch (error) {
    console.error("Lỗi khi gọi API Gemini:", error);
  }
};
module.exports = {
  getUserApi,
  getInfoApi,
  getReleaseChartApi,
  getSongInfoApi,
  getSongApi,
  getListSongArtistApi,
  getDetailPlayListApi,
  getNewReleaseChartApi,
  getChartHomeApi,
  getSearchSongApi,
  getArtistApi,
  getLyricApi,
  getTopApi,
  chat,
};
