const User = require("../modules/user.module");
const x = require("../returnAPI");
const fs = require("fs");
const payload = x.payload;

const jwtHelper = require("../jwt/jwt.helper");
let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "3h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "123456789";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "123456789";
// Thời gian sống của refreshToken
exports.sendMail = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.senMail(host, req.params.id, (reqnse) => payload(res, reqnse));
};
exports.getAll = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.getAll(host, (reqnse) => payload(res, reqnse));
};
exports.login = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.postUser(host, req.body, async (payload) => {
    if (!payload) {
      res.status("200").json({
        errorCode: 404,
        errorMessage: "Not Found",
      });
    } else if (payload.code) {
      switch (parseInt(payload.code)) {
        case 303:
          res.status("303").json({
            errorCode: 303,
            errorMessage: "See Other",
          });
          break;
        case 400:
          res.status("400").json({
            errorCode: 400,
            errorMessage: "Bad Request",
          });
          break;
        case 401:
          res.status("401").json({
            errorCode: 401,
            errorMessage: "Unauthorized",
          });
          break;
        case 405:
          res.status("405").json({
            errorCode: 405,
            errorMessage: "Method Not Allowed",
          });
          break;
        case 406:
          res.status("200").json({
            errorCode: 406,
            errorMessage: "Not Acceptable",
          });
          break;
        default:
          res.status("200").json({
            errorCode: payload.code,
            errorMessage: payload.message,
          });
          break;
      }
    } else {
      const accessToken = await jwtHelper.generateToken(
        payload,
        accessTokenSecret,
        accessTokenLife
      );
      const refreshToken = await jwtHelper.generateToken(
        payload,
        refreshTokenSecret,
        refreshTokenLife
      );
      tokenList[refreshToken] = { accessToken, refreshToken };
      res.status("200").json({
        errorCode: 0,
        data: payload,
        token: accessToken,
      });
    }
  });
};
exports.logOut = (req, res) => {
  req.logout();
  res.status("200").json({
    errorCode: 0,
    isLogin: false,
    data: [],
  });
};
exports.authCallback = (req, res) => {
  console.log(res);
  console.log(req);
};
exports.checkUser = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.checkUser(host, req.user, (reqnse) => payload(res, reqnse));
};
exports.refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.headers["authorization"];
  console.log(refreshTokenFromClient);
  console.log(tokenList.refreshTokenFromClient);
  if (refreshTokenFromClient) {
    // if (refreshTokenFromClient && tokenList[refreshTokenFromCli ent]){
    const decoded = await jwtHelper.verifyToken(
      refreshTokenFromClient,
      refreshTokenSecret
    );
    const userFakeData = decoded.data;
    const accessToken = await jwtHelper.generateToken(
      userFakeData,
      accessTokenSecret,
      accessTokenLife
    );
    User.getById(userFakeData.id, (reqnse) => {
      res.status("200").json({
        errorCode: 0,
        data: reqnse,
        token: accessToken,
      });
    });
  } else {
    res.status(403).json({
      errorCode: 403,
      errorMessage: "Invalid refresh token.",
    });
  }
};
exports.addUser = (req, res) => {
  User.adduser(req.headers.host, req, (reqnse) => payload(res, reqnse));
};
exports.getUser_detail = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.getById(host, req.params.id, (reqnse) => payload(res, reqnse));
};
exports.updateUser = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  User.update(host, req.body, req.params.id, (reqnse) => payload(res, reqnse));
};
exports.deleteUser = (req, res) => {
  User.remove(req.params.id, (reqnse) => payload(res, reqnse));
};
