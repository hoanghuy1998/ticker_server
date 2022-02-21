const multer = require("multer");
const passport = require("passport");
const maxSize = 2 * 1024 * 1024;
const upload = multer({
  dest: "temp/",
  limit: { fileSize: maxSize },
});
module.exports = (login) => {
  const loginUser = require("../controllers/user.controller");
  const authMiddleware = require("../middleware/authMiddleware");
  login.post("/login", loginUser.login);
  login.get("/refresh-token", loginUser.refreshToken);
  login.post("/user", upload.single("avata"), loginUser.addUser);
  login.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );
  login.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/checkUser",
      failureRedirect: "/fails",
    })
  );
  login.post("/reset_password/:id", loginUser.sendMail);
  login.get("/account", ensureAuthenticated, function (req, res) {});
  login.get("/checkUser", loginUser.checkUser);
  login.get("/logout", loginUser.logOut);
  // login.use(authMiddleware.isAuth);
  login.get("/user/:id", loginUser.getUser_detail);
  login.get("/user", loginUser.getAll);
  login.post("/user", loginUser.addUser);
  login.put("/user/:id", loginUser.updateUser);
  login.delete("/user/:id", loginUser.deleteUser);
};
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
