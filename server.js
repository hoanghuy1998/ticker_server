const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 9000;
const engine = require("express-handlebars");

//cấu hình cors
app.use(cors());
// cấu hình body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use("/data", express.static(__dirname + "/resoures/avatars"));
app.use("/data", express.static(__dirname + "/resoures/imgs"));
/*config is our configuration variable.*/
// Passport session setup.
app.get("/", function (req, res) {
  res.send("Hello World");
});
// app.engine(".hbs", engine({ extname: ".hbs" }));
// app.set("view engine", ".hbs");
// mailer.sendMail();
require("./routers/user.router")(app);
require("./routers/product.router")(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
