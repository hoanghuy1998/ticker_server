const mysql = require("mysql");
const connectMysql = mysql.createConnection({
  // database: local,
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "ticker_db",
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "dbcozastore",
  // database: server
  // host: "sql6.freemysqlhosting.net",
  // user: "sql6471111",
  // password: "p9pyzmkTcR",
  // database: "sql6471111",
  // clever server
  host: "bxpye38re6cdqvtet7ba-mysql.services.clever-cloud.com",
  user: "ueuybu7trb33ogmr",
  password: "mEiC3wZmoLZOZqkzqgax",
  database: "bxpye38re6cdqvtet7ba",
});
connectMysql.connect((err) => {
  if (err) {
    console.log("connect fails");
    console.log(err);
  } else {
    console.log("coneted mysql ");
  }
});
module.exports = connectMysql;
