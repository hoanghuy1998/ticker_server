const jwt = require("jsonwebtoken");

/**
 * private function generateToken
 * @param user
 * @param secretSignature
 * @param tokenLife
 */
let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    console.log("userrr", user);
    const userData = {
      id: user.id,
      name: user.name,
      password: user.password,
    };
    // Thực hiện ký và tạo token
    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
