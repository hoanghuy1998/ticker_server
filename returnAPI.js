exports.payload = (res, payload) => {
  if (!payload) {
    res.status("200").json({
      errorCode: 404,
      data: [],
    });
  } else if (payload.code) {
    switch (parseInt(payload.code)) {
      case 200:
        res.status("200").json({
          errorCode: 400,
          errorMessage: payload.message,
        });
        break;
      case 303:
        res.status("303").json({
          errorCode: 303,
          errorMessage: "See Other",
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
        res.status("406").json({
          errorCode: 406,
          errorMessage: "Not Acceptable",
        });
        break;
      default:
        res.status("400").json({
          errorCode: payload.code,
          errorMessage: payload.message,
        });
        break;
    }
  } else {
    res.status("200").json({
      errorCode: 0,
      data: payload,
    });
  }
};
exports.convertSrc = (host, a) => {
  a.forEach((a) => {
    a.srcImg = `${host}${a.srcImg}`;
  });
};
exports.parse = (a) => {
  a.forEach((a) => {
    if (a.type) a.type = JSON.parse(a.type);
    if (a.status) a.status = JSON.parse(a.status);
    if (a.contents) a.contents = JSON.parse(a.contents);
    if (a.taps) a.taps = JSON.parse(a.taps);
    if (a.details) a.details = JSON.parse(a.details);
  });
};
exports.stringify = (a) => {
  a.forEach((a) => {
    console.log(a.id);
    if (a.type) a.type = JSON.stringify(a.type);
    if (a.status) a.status = JSON.stringify(a.status);
    if (a.contents) a.contents = JSON.stringify(a.contents);
    if (a.taps) a.taps = JSON.stringify(a.taps);
    if (a.details) a.details = JSON.stringify(a.details);
  });
};
exports.getDate = () => {
  const today = new Date();
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
};
exports.getFullDate = () => {
  const today = new Date();
  return (
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    "-" +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds()
  );
};
// {
// "customerName": "fdsfad",
// "adadress": "fdafsd",
// "phone": "fdfasd",
// "city": "ddafd",
// "ward":"fas",
// "city": "dfsaf,
// details: [1,2,4]
// }
