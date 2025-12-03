require("dotenv").config();
const express = require("express");
// const connection = require("./config/database");
const configViewEngine = require("./config/viewEngine");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;
const api = require("./routes/app");
const apiRouter = require("./routes/api");
const cors = require("cors");
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(cors());
configViewEngine(app);
app.use(api);
app.use("/v1/api", apiRouter);
(async () => {
  try {
    // await connection();
    app.listen(port, () => {
      console.log(`${port} dang chay`);
    });
  } catch (err) {
    console.log(err);
  }
})();
