const db = require("../commons/connect_mysql");
const fs = require("fs");
const path = require("path");
const __basedir = path.join(__dirname, "../resoures/avatars/");
const x = require("../returnAPI");
const nowDate = x.getDate;
const convertSrc = x.convertSrc;
var pbkdf2 = require("pbkdf2");
const saltRounds = 10;
const mailer = require("../middleware/sendMail");

//)
//test get name
// db.query(
//   "select * from listuser where email='" + "hhhuy17101998@gmail.com" + "'     ",
//   function (err, user) {
//     console.log("err", err);
//     console.log("user", user);
//   }
// );

const makeid = (l) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const makePass = (l) => {
  var result = "";
  var characters = "0123456789qưertyuiopasdfghjklzxcvbnm";
  var charactersLength = characters.length;
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const hashPass = (p) => {
  return pbkdf2.pbkdf2Sync(p, "salt", 1, saltRounds, "sha512").toString("hex");
};
const User = (User) => {
  (this.id = User.id),
    (this.userid = User.userid),
    (this.name = User.name),
    (this.avata = User.avata),
    (this.email = User.email),
    (this.gender = this.gender),
    (this.password = User.password),
    (this.phone = User.phone),
    (this.dateofbirth = User.dateofbirth),
    (this.role = User.role);
  (this.adress = User.adress),
    (this.ward = User.ward),
    (this.district = User.district),
    (this.city = User.city),
    (this.create_at = User.create_at),
    (this.update_at = User.update_at),
    (this.coins = User.coins);
};
User.getAll = (host, result) => {
  let newData = [];
  db.query("SELECT * FROM listuser", (err, user) => {
    if (err) {
      result({
        errorCode: err.errno,
        errorMessage: err.message,
      });
    } else if (user.length === 0) result(null);
    else {
      user.map((u) => {
        newData = [
          ...newData,
          {
            id: u.id,
            userid: u.userid,
            name: u.name,
            email: u.email,
            avata: `${host}${u.avata}`,
            phone: u.phone,
            adress: u.adress,
            ward: u.ward,
            district: u.district,
            city: u.city,
            dateofbirth: u.dateofbirth,
            role: u.role,
          },
        ];
      });
      convertSrc(host, user);
      result(newData);
    }
  });
};
User.senMail = async (host, id, result) => {
  try {
    db.query("SELECT * FROM listuser WHERE id=?", id, (err, user) => {
      if (err) {
        result({
          code: err.errno,
          message: err.message,
        });
      } else {
        const newPassWord = makePass(10);
        const newData = {
          ...user[0],
          password: hashPass(newPassWord),
          update_at: nowDate(),
        };
        db.query(
          `UPDATE listuser SET name=?,userid=?,avata=?,gender=?,email=?,adress=?,create_at=?,update_at=?,dateofbirth=?,password=?,coins=?,ward=?,district=?,city=?,phone=?  WHERE id=?`,
          [
            newData.name,
            newData.userid,
            newData.avata,
            newData.gender,
            newData.email,
            newData.adress,
            newData.create_at,
            newData.update_at,
            newData.dateofbirth,
            newData.password,
            newData.coins,
            newData.ward,
            newData.district,
            newData.city,
            newData.phone,
            id,
          ],
          (err, updateUser) => {
            if (err) {
              result({
                code: err.errno,
                message: err.message,
              });
            } else if (updateUser.length === 0) result(null);
            else {
              const payload = {
                name: newData.name,
                email: newData.email,
                coins: newData.coins,
                id: newData.id,
                userid: newData.userid,
                avata: `${host}${newData.avata}`,
              };
              const content = `
              Xin Chào Quý Khách 
              Tài Khoản Của Quý Khách Hiện Đã Được Reset Mật Khẩu Thành Công
              Mật Khẩu Hiện Tại Là :${newPassWord}
              `;
              mailer.sendMail(user[0].email, "REST PASSWORD", content);
              // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
              result("success");
            }
          }
        );
      }
    });
  } catch (error) {
    // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
    console.log(error);
    result({
      code: 400,
      message: "error",
    });
  }
};
User.checkUser = (host, data, result) => {
  console.log("do dAY");
  const chekcNewDataAsnyc = new Promise((resolve, reject) => {
    db.query(
      "select * from listuser where name='" + data.displayName + "'     ",
      (err, user) => {
        if (err || user.length === 0) reject(data);
        else resolve(user[0]);
      }
    );
  });
  chekcNewDataAsnyc
    .then((data) => {
      const newDataUser = { ...data };
      const payload = {
        id: newDataUser.id,
        userid: newDataUser.userid,
        name: newDataUser.name,
        email: newDataUser.email,
        avata: `${host}Avatar-Facebook.jpg`,
        phone: newDataUser.phone,
        adress: newDataUser.adress,
        ward: newDataUser.ward,
        district: newDataUser.district,
        city: newDataUser.city,
        dateofbirth: newDataUser.dateofbirth,
        role: newDataUser.role,
        coins: [],
      };
      result(payload);
    })
    .catch((err) => {
      console.log("err", err);
      const newDataUser = {
        name: err?.displayName || err?.name,
        email: err.email ? err.email : "example@gmail.com",
        userid: err.id,
        phone: err.phone ? err.phone : 0909090909,
        dateofbirth: err.dateofbirth ? err.dateofbirth : 18,
        create_at: nowDate(),
        update_at: nowDate(),
        adress: err.adress ? err.adress : "số 2 đinhh tiên hoàn",
        ward: err.ward ? err.ward : "phường 7",
        district: err.district ? err.district : "quận 4",
        city: err.city ? err.city : "TP HCM",
      };
      console.log(newDataUser);
      db.query("INSERT INTO listuser SET ?", newDataUser, (err, x) => {
        if (err) {
          result({
            code: err.errno,
            message: err.message,
          });
        } else {
          const payload = {
            id: newDataUser.id,
            userid: newDataUser.userid,
            name: newDataUser.name,
            email: newDataUser.email,
            avata: `${host}Avatar-Facebook.jpg`,
            phone: newDataUser.phone,
            adress: newDataUser.adress,
            ward: newDataUser.ward,
            district: newDataUser.district,
            city: newDataUser.city,
            dateofbirth: newDataUser.dateofbirth,
            role: newDataUser.role,
            coins: [],
          };
          result(payload);
        }
      });
    });
};
User.postUser = (host, data, result) => {
  db.query("SELECT * FROM listuser", data, (err, user) => {
    if (err) {
      result({
        code: err.errno,
        message: err.message,
      });
    } else {
      const x = user.filter((u) => u.email === data.email);
      if (x && x.length > 0) {
        const hashPasswordAnsyc = new Promise((resolve, reject) => {
          const y = pbkdf2
            .pbkdf2Sync(data.password, "salt", 1, saltRounds, "sha512")
            .toString("hex");
          if (x[0].password === y) {
            const dataPayload = {
              name: x[0].name,
              email: x[0].email,
              coins: x[0].coins,
              id: x[0].id,
              userid: x[0].userid,
              avata: `${host}${x[0].avata}`,
              adress: x[0].adress,
              ward: x[0].ward,
              district: x[0].district,
              city: x[0].city,
              role: x[0].role,
              phone: x[0].phone,
            };
            resolve(dataPayload);
          } else {
            reject({
              code: 200,
              message: "password wront",
            });
          }
        });
        hashPasswordAnsyc
          .then((data) => {
            console.log("data", data);
            result(data);
          })
          .catch((err) => result(err));
      } else
        result({
          code: 404,
          message: "email invalid",
        });
    }
  });
};

User.adduser = (headers, req, result) => {
  // data = {
  //   name,
  //   email,
  //   password,
  //   adress,
  //   ward,
  //   district,
  //   city,
  //   dateofbirth,
  // };

  if (req.file) {
    const x = req.file.originalname;
    const file = x.slice(0, x.lastIndexOf("."));
    const type = x.slice(x.lastIndexOf("."));
    let fileName = file + "-" + Date.now() + type;
    let newFile = __basedir + fileName;
    const readFileAsnyc = new Promise((resolve, reject) => {
      fs.readFile(req.file.path, (err, data) => {
        if (err) reject(err);
        else {
          fs.writeFile(newFile, data, (err2) => {
            if (err2) reject(err2);
            else {
              fs.unlink(req.file.path, (err3) => {
                if (err3) reject(err3);
                else resolve(req.body);
              });
            }
          });
        }
      });
    });
    readFileAsnyc
      .then((data) => {
        const getuseridAsnyc = new Promise((resolve, reject) => {
          if (!data.coins) data.coins = [];
          else data.coins = JSON.stringify(data.coins);
          db.query("SELECT * FROM listuser", (err, user) => {
            if (err) {
              reject({
                code: err.errno,
                message: err.message,
              });
            } else {
              let newuserid;
              if (user.length === 0) newuserid = makeid(10);
              else {
                do newuserid = makeid(10);
                while (user.forEach((u) => u.userid === newuserid));
              }
              resolve({ data, newuserid, user });
            }
          });
        });
        return getuseridAsnyc;
      })
      .then(({ data, newuserid, user }) => {
        const hashPasswordAnsyc = new Promise((resolve, reject) => {
          const x = pbkdf2
            .pbkdf2Sync(data.password, "salt", 1, saltRounds, "sha512")
            .toString("hex");
          data.password = x;
          resolve({ data, newuserid, user });
        });
        return hashPasswordAnsyc;
      })
      .then(({ data, newuserid, user }) => {
        const createNewDataUserAnsyc = new Promise((resolve, reject) => {
          const newDataUser = {
            ...data,
            userid: newuserid,
            avata: fileName,
            create_at: nowDate(),
            update_at: nowDate(),
            adress: data.adress ? data.adress : "số 2 đinhh tiên hoàn",
            ward: data.ward ? data.ward : "phường 7",
            district: data.district ? data.district : "quận 4",
            city: data.city ? data.city : "TP HCM",
          };
          if (newDataUser) resolve({ newDataUser, user });
          else reject(null);
        });
        return createNewDataUserAnsyc;
      })
      .then(({ newDataUser, user }) => {
        const checkEmailAnsyc2 = new Promise((resolve, reject) => {
          const check = user.filter((u) => u.email === newDataUser.email);
          if (check.length > 0) {
            fs.unlink(`${__basedir}${newDataUser.avata}`, (err3) => {});
            reject({
              code: 200,
              message: "Email already exists",
            });
          } else resolve(newDataUser);
        });
        return checkEmailAnsyc2;
      })
      .then((data) => {
        const addUserAsnyc = new Promise((resolve, reject) => {
          data.coins = JSON.stringify(data.coins);
          db.query("INSERT INTO listuser SET ?", data, (err, x) => {
            if (err) {
              reject({
                code: err.errno,
                message: err.message,
              });
            } else {
              const payload = {
                name: data.name,
                email: data.email,
              };
              resolve(payload);
            }
          });
        });
        return addUserAsnyc;
      })
      .then((data) => result(data))
      .catch((err) => result(err));
  } else result({ code: 400 });
};
User.getById = (host, id, result) => {
  db.query("SELECT * FROM listuser WHERE id=?", id, (err, user) => {
    if (err) {
      result({
        code: err.errno,
        message: err.message,
      });
    } else if (user.length === 0) result(null);
    else {
      const payload = {
        id: user[0].id,
        userid: user[0].userid,
        name: user[0].name,
        email: user[0].email,
        avata: `${host}${user[0].avata}`,
        phone: user[0].phone,
        adress: user[0].adress,
        ward: user[0].ward,
        district: user[0].district,
        city: user[0].city,
        dateofbirth: user[0].dateofbirth,
        role: user[0].role,
        coins: user[0].coins,
      };
      result(payload);
    }
  });
};
User.remove = (id, result) => {
  db.query("DELETE  FROM listuser WHERE id=?", id, (err, user) => {
    if (err) {
      result({
        code: err.errno,
        message: err.message,
      });
    } else result("xóa thành công phần tử tại id là" + " " + id);
  });
};
User.update = (host, array, id, result) => {
  db.query("SELECT * FROM listuser WHERE id=?", id, (err, user) => {
    let newData = {};
    user.map((user) => {
      newData = {
        ...user,
        email: array.email ? array.email : user.email,
        name: array.name ? array.name : user.name,
        password: array.password ? array.password : user.password,
        update_at: nowDate(),
        coins: array.coins ? JSON.stringify(array.coins) : user.coins,
        avata: array.avata ? array.avata : user.avata,
        adress: array.adress ? array.adress : user.adress,
        ward: array.ward ? array.ward : user.ward,
        district: array.district ? array.district : user.district,
        city: array.city ? array.city : user.city,
      };
    });
    if (newData) {
      // newData.coins = JSON.stringify(newData.coins);
      db.query(
        `UPDATE user SET name=?,userid=?,avata=?,gender=?,email=?,adress=?,create_at=?,update_at=?,dateofbirth=?,password=?,coins=?,ward=?,district=?,city=?,phone=?  WHERE id=?`,
        [
          newData.name,
          newData.userid,
          newData.avata,
          newData.gender,
          newData.email,
          newData.adress,
          newData.create_at,
          newData.update_at,
          newData.dateofbirth,
          newData.password,
          newData.coins,
          newData.ward,
          newData.district,
          newData.city,
          newData.phone,
          id,
        ],
        (err, updateUser) => {
          console.log("err", err);
          if (err) {
            result({
              code: err.errno,
              message: err.message,
            });
          } else if (updateUser.length === 0) result(null);
          else {
            const payload = {
              name: newData.name,
              email: newData.email,
              coins: JSON.parse(newData.coins),
              id: newData.id,
              userid: newData.userid,
              avata: `${host}${newData.avata}`,
            };
            console.log("payload", payload);
            result(payload);
          }
        }
      );
    }
  });
};
module.exports = User;
