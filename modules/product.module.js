const db = require("../commons/connect_mysql");
const x = require("../returnAPI");
const fs = require("fs");
const path = require("path");
const __basedirImgPrimary = path.join(__dirname, "../resoures/imgs/");
const convertSrc = x.convertSrc;
const nowDate = x.getDate;

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
const makeid = (l) => {
  var result = "";
  var characters = "0123456789qưertyuiopasdfghjklzxcvbnm";
  var charactersLength = characters.length;
  for (var i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const format2 = (n, c) => {
  return n.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " " + c;
};
const formatDate = (d) => {
  d = JSON.stringify(d);
  console.log("d", typeof d);
  return (
    parseInt(d?.slice(9, 11)) + 1 + "-" + d?.slice(6, 8) + "-" + d?.slice(1, 5)
  );
};
const returnInfo = (a) => {
  const x = [];

  a.forEach((a) => {
    x.push({
      id: a.id,
      type: a.type,
      price: format2(a.price, "vnđ"),
      saleof: a.saleof,
      expirationdate: formatDate(a.expirationdate),
    });
  });
  return x;
};
const Allproduct = (allproduct) => {
  (this.id = allproduct.id),
    (this.productid = allproduct.productid),
    (this.srcimg = allproduct.srcimg),
    (this.description = this.description),
    (this.saleof = this.saleof),
    (this.price = allproduct.price),
    (this.expirationdate = allproduct.expirationdate),
    (this.status = allproduct.status),
    (this.report = allproduct.report),
    (this.type = allproduct.type),
    (this.create_at = allproduct.create_at),
    (this.update_at = allproduct.update_at),
    (this.account = allproduct.account),
    (this.password = allproduct.password),
    (this.quantitys = allproduct.quantitys),
    (this.nameproduct = allproduct.nameproduct);
};
Allproduct.get_all = (host, result) => {
  let i = 0;
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      convertSrc(host, allproduct);
      result(returnInfo(allproduct));
    }
  });
};

Allproduct.getById = (host, id, result) => {
  console.log("id", id);
  db.query("SELECT * FROM listproduct WHERE id=?", id, (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      convertSrc(host, allproduct);
      result(returnInfo(allproduct)[0]);
    }
  });
};
Allproduct.getByParam = (host, param, result) => {
  console.log("param", param);
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      convertSrc(host, allproduct);

      let data = [];
      if (param.search && param.search != "undefined") {
        console.log("do search");
        const results = allproduct.filter(
          (p) =>
            p.quantitys === param.search ||
            p.productid === param.search ||
            p.type === param.search ||
            p.account === param.search ||
            p.nameproduct === param.search
        );
        if (results.length === 0) {
          result(null);
        } else result(returnInfo(results));
      } else if (
        param.sort &&
        param.order &&
        param.sort != "undefined" &&
        param.order != "undefined"
      ) {
        if (param.order === "asc") allproduct.sort(dynamicSort(param.sort));
        else allproduct.sort(dynamicSort(`-${param.sort}`));
        result(returnInfo(allproduct));
      } else if (
        param.start &&
        param.end &&
        param.start != "undefined" &&
        param.end != "undefined"
      ) {
        allproduct.sort(dynamicSort("price"));
        const filer = allproduct.filter(
          (a) =>
            a.price >= parseInt(param.start) && a.price <= parseInt(param.end)
        );
        if (filer.length > 0) result(returnInfo(filer));
        else result(null);
      } else if (param.start && param.start != "undefined") {
        allproduct.sort(dynamicSort("price"));
        const filter = allproduct.filter(
          (a) => a.price >= parseInt(param.start)
        );
        if (filter.length > 0) {
          result(returnInfo(filter));
        } else result(null);
      } else if (!param) {
        result(returnInfo(allproduct));
      }
    }
  });
};
// Allproduct.productFilterQuery = (host, query, result) => {
//   db.query("SELECT * FROM listproduct", (err, allproduct) => {
//     if (err) {
//       result({
//         code: err.errno,
//         errorMessage: err.message,
//       });
//     } else if (allproduct.length === 0) result(null);
//     else {
//       convertSrc(host, allproduct);

//       let datas = [];
//       const fil = allproduct.map((a) => {
//         // const b = a.type.filter((t) => t === query.type);
//         if (b.length > 0) datas.push(a);
//       });
//       if (query.type && query.search && query.search != "undefined") {
//         if (datas) {
//           let dataQuery = [];
//           const x = datas.filter(
//             (f) =>
//               f.quantitys === query.search ||
//               f.report === query.search ||
//               f.tag === query.search
//           );
//           if (x.length > 0) result(x);
//           else {
//             datas.map((d) => {
//               const e = d.status.filter((s) => s === query.search);
//               if (e.length > 0) dataQuery.push(d);
//             });
//             convertSrc(host, dataQuery);
//             result(dataQuery);
//           }
//         } else result(null);
//       } else if (
//         query.type &&
//         query.start &&
//         query.start &&
//         query.end &&
//         query.start != "undefined" &&
//         query.end != "undefined"
//       ) {
//         console.log("do start and  end");
//         datas.sort(dynamicSort("price"));
//         const slice = datas.filter(
//           (f) => f.price >= query.start && f.price <= query.end
//         );
//         if (slice) {
//           result(slice);
//         } else result(null);
//       } else if (
//         query.type &&
//         query.start &&
//         query.start != "undefined" &&
//         query.end === "undefined"
//       ) {
//         console.log("do start and no end");
//         datas.sort(dynamicSort("price"));
//         const slice = datas.filter((f) => f.price >= query.start);
//         if (slice) {
//           result(slice);
//         } else result(null);
//       }
//     }
//   });
// };
Allproduct.productSortQuery = (host, query, result) => {
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      convertSrc(host, allproduct);

      let newData = [];
      allproduct.map((a) => {
        const b = a.type.filter((t) => t === query.type);
        if (b.length > 0) newData.push(a);
      });
      if (newData.length > 0) {
        if (query.order === "asc") {
          newData = newData.sort(dynamicSort(query.sort));
          result(newData);
        } else {
          newData = newData.sort(dynamicSort(`-${query.sort}`));
          result(newData);
        }
      } else result(null);
    }
  });
};
Allproduct.productFullSearchQuery = (host, query, result) => {
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      let newData = [];

      allproduct.map((a) => {
        const x = a.type.filter((t) => t === query.type);
        if (x.length > 0) newData.push(a);
      });
      let searchs = [];
      const q = newData.map(
        (a) => a.nameproduct.toLowerCase().search(query.search) != -1
      );
      for (var i = 0; i < q.length; i++) {
        if (q[i] === true) {
          searchs.push(newData[i]);
        }
      }
      if (searchs.length > 0) {
        convertSrc(host, searchs);
        result(searchs);
      } else result(null);
    }
  });
};
Allproduct.getFullSearch = (host, query, result) => {
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      if (query.search) {
        let searchs = [];
        const q = allproduct.map(
          (a) =>
            a.nameproduct.toLowerCase().search(query.search) != -1 ||
            a.account.toLowerCase().search(query.search) != -1 ||
            a.productid.toLowerCase().search(query.search) != -1
        );
        for (var i = 0; i < q.length; i++) {
          if (q[i] === true) {
            searchs.push(allproduct[i]);
          }
        }
        if (searchs.length > 0) {
          convertSrc(host, searchs);

          result(returnInfo(searchs));
        } else result(null);
      } else result({ code: 405 });
    }
  });
};
Allproduct.getPaging = (host, param, result) => {
  console.log("param", param);
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      convertSrc(host, allproduct);
      console.log("allproduct", allproduct);
      if (param.page && param.perpage) {
        console.log("do day");
        const page = parseInt(param.page);
        const perpage = parseInt(param.perpage);
        const totalPage = Math.ceil(allproduct.length / perpage);
        //
        const slice = allproduct.slice(
          page * perpage,
          page * perpage + perpage
        );
        //

        if (slice.length > 0)
          result({
            data: returnInfo(slice),
            pagingInfo: {
              page: page,
              pageLength: allproduct.length,
              totalRecord: perpage,
              totalPage: totalPage,
            },
          });
        else result(null);
      } else {
        result(allproduct);
      }
    }
  });
};
Allproduct.getPagingSearch = (host, param, result) => {
  console.log("param ", param);
  db.query("SELECT * FROM listproduct", (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        errorMessage: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      let results = [];
      convertSrc(host, allproduct);

      if (param.page && param.perpage && param.search) {
        results = allproduct.filter(
          (p) =>
            p.report === param.search ||
            p.tag === param.search ||
            p.quantitys === param.search
        );
        console.log("results", results);
        if (results.length === 0) {
          allproduct.map((a) => {
            const b = a.status?.filter((s) => s === param.search);
            if (b.length > 0) results.push(a);
          });
          allproduct.map((a) => {
            const b = a.type?.filter((t) => t === param.search);
            if (b.length > 0) results.push(a);
          });
        }
        const page = parseInt(param.page);
        const perpage = parseInt(param.perpage);
        const totalPage = Math.ceil(results.length / perpage);
        //
        const slice = results.slice(page * perpage, page * perpage + perpage);
        //
        if (slice) {
          result({
            data: slice,
            pagingInfo: {
              page: page,
              pageLength: results.length,
              totalRecord: perpage,
              totalPage: totalPage,
            },
          });
        } else result(null);
      } else {
        result(allproduct);
      }
    }
  });
};
// Allproduct.create = (host, req, result) => {
//   const dataProduct = req.body;
//   const img = req.files["srcimg"][0];
//   const imgDescription = req.files["imgDescription"];
//   if (img && imgDescription) {
//     const nameproductCurrentImgPrimary = img.originalnameproduct;
//     const file = nameproductCurrentImgPrimary.slice(
//       0,
//       nameproductCurrentImgPrimary.lastIndexOf(".")
//     );
//     const type = nameproductCurrentImgPrimary.slice(
//       nameproductCurrentImgPrimary.lastIndexOf(".")
//     );
//     let filenameproduct = file + "-" + Date.now() + type;
//     let newFile = __basedirImgPrimary + filenameproduct;
//     const saveImgAsnyc = new Promise((resolve, reject) => {
//       fs.readFile(img.path, function (err, data) {
//         fs.writeFile(newFile, data, (err) => {
//           if (err) reject("save fail");
//           else {
//             fs.unlink(img.path, (err2) => {
//               if (err2) reject("delete fali");
//               else resolve("success");
//             });
//           }
//         });
//       });
//     });
//     saveImgAsnyc
//       .then((data) => {
//         const getAllProductAsnyc = new Promise((resolve, reject) => {
//           db.query("SELECT * FROM listproduct", (err, allproduct) => {
//             if (err) reject(err);
//             else resolve(allproduct);
//           });
//         });
//         return getAllProductAsnyc;
//       })
//       .then((data) => {
//         const getNewdataAsnyc = new Promise((resolve, reject) => {
//           let newproductid = "";
//           if (data.length === 0) {
//             newproductid = makeid(10);
//           } else {
//             do {
//               newproductid = makeid(10);
//             } while (data.forEach((a) => a.productid === newproductid));
//           }
//           let newData = {
//             ...dataProduct,
//             type: JSON.stringify(dataProduct.type.split(",")),
//             status: JSON.stringify(dataProduct.status.split(",")),
//             productid: newproductid,
//             srcimg: filenameproduct,
//             create_at: nowDate(),
//             update_at: nowDate(),
//           };
//           delete newData.method;
//           delete newData.id;
//           resolve(newData);
//         });
//         return getNewdataAsnyc;
//       })
//       .then((data) => {
//         const addProductAnsyc = new Promise((resolve, reject) => {
//           db.query("INSERT INTO listproduct SET ?", data, (err, newProduct) => {
//             if (err) {
//               reject({
//                 code: err.errno,
//                 message: err.message,
//               });
//             } else if (newProduct.length === 0) reject(null);
//             else resolve(data.productid);
//           });
//         });
//         return addProductAnsyc;
//       })
//       .then((data) => {
//         const readFileAsnyc = new Promise((resolve, reject) => {
//           imgDescription.forEach((f, i) => {
//             const nameproductCurrentImgDescription =
//               imgDescription[i].originalnameproduct;
//             const fileDescription = nameproductCurrentImgDescription.slice(
//               0,
//               nameproductCurrentImgDescription.lastIndexOf(".")
//             );
//             const typeDescription = nameproductCurrentImgDescription.slice(
//               nameproductCurrentImgDescription.lastIndexOf(".")
//             );
//             let filenameproductDescription =
//               fileDescription + "_" + data + typeDescription;
//             let newFileDescription =
//               __basedirImgDescription + filenameproductDescription;
//             fs.readFile(f.path, (err, data1) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 fs.writeFile(newFileDescription, data1, (err2) => {
//                   if (err2 && i === imgDescription.length - 1) reject(err2);
//                   else if (err2 && i < imgDescription.length - 1) return;
//                   else if (!err && i < imgDescription.length - 1) {
//                     listProductDescription.push({
//                       productid: data,
//                       srcimg: filenameproductDescription,
//                     });
//                   } else {
//                     listProductDescription.push({
//                       productid: data,
//                       srcimg: filenameproductDescription,
//                     });
//                     console.log(listProductDescription);
//                     resolve(listProductDescription);
//                   }
//                 });
//               }
//             });
//           });
//         });
//         return readFileAsnyc;
//       })
//       .then((data) => {
//         console.log("listProducDecription", data);
//         const addProductDescriptionAsnyc = new Promise((resolve, reject) => {
//           data.forEach((d, i) => {
//             db.query(
//               "INSERT INTO productdescription SET ?",
//               d,
//               (err, productSolded) => {
//                 console.log(err);
//                 if (err && i === data.length - 1) {
//                   reject({
//                     code: err.errno,
//                     message: err.message,
//                   });
//                 } else if (err) return;
//                 else {
//                   console.log("do day");
//                   console.log("i+1", i + 1);
//                   console.log("data.length - 1", data.length);
//                   if (i + 1 === data.length) {
//                     console.log("do 2");
//                     resolve(d.productid);
//                   }
//                 }
//               }
//             );
//           });
//         });
//         return addProductDescriptionAsnyc;
//       })
//       .then((data) => result(data))
//       .catch((err) => result(err));
//   } else {
//     result({ code: 400 });
//   }
// };
Allproduct.create = (host, data, result) => {};
Allproduct.remove = (id, result) => {
  const getProductAsnyc = new Promise((resolve, reject) => {
    db.query("SELECT * FROM products WHERE id=?", id, (err, allproduct) => {
      if (err) {
        reject({
          code: err.errno,
          message: err.message,
        });
      } else if (allproduct.length === 0) reject(null);
      else {
        fs.unlink(
          `${__basedirImgPrimary}${allproduct[0].srcimg}`,
          function (err2) {
            if (err2) reject({ code: err2.errno, message: err2.message });
            else resolve(allproduct[0]);
          }
        );
      }
    });
  });
  getProductAsnyc
    .then((data) => {
      const deleteProductAsnyc = new Promise((resolve, reject) => {
        db.query("DELETE  FROM products WHERE id=?", id, (err, allproduct) => {
          if (err) {
            reject({
              code: err.errno,
              message: err.message,
            });
          } else resolve(data);
        });
      });
      return deleteProductAsnyc;
    })
    .then((data) => {
      const getProductDescriptionAsnyc = new Promise((resolve, reject) => {
        db.query("SELECT * FROM productdescription", (err, product) => {
          if (err) {
            reject({
              code: err.errno,
              message: err.message,
            });
          } else if (product.length === 0) reject("null");
          else {
            const x = product.filter(
              (p) => p.productid === parseInt(data.productid)
            );
            if (x) resolve(x);
            else reject("null");
          }
        });
      });
      return getProductDescriptionAsnyc;
    })
    .then((data) => {
      console.log("data 2", data);
      let listId = [];
      const deleteFileDescription = new Promise((resolve, reject) => {
        if (data.length > 0) {
          data.forEach((d) => {
            listId.push(d.id);
            fs.unlink(`${__basedirImgDescription}${d.srcimg}`, function (err3) {
              if (err3) reject({ code: err3.errno, message: err3.message });
              else resolve(listId);
            });
          });
        } else resolve([]);
      });
      return deleteFileDescription;
    })
    .then((data) => {
      const deleteDescriptionAsnyc = new Promise((resolve, reject) => {
        if (data.length > 0) {
          data.forEach((id, index) => {
            db.query(
              "DELETE  FROM productdescription WHERE id=?",
              id,
              (err4) => {
                if (err4) {
                  if (index === data.length - 1) {
                    reject({
                      code: err4.errno,
                      message: err4.message,
                    });
                  }
                  return;
                } else {
                  if (index === data.length - 1) {
                    resolve("success");
                  }
                }
              }
            );
          });
        } else resolve("not image description");
      });
      return getProductDescriptionAsnyc;
    })
    .then((data) => {
      console.log(data);
      result(data);
    })
    .catch((err) => {
      result(err);
    });

  // db.query("DELETE  FROM products WHERE id=?", id, (err, allproduct) => {
  //   if (err) result({ code: 400 });
  //   else result("xóa thành công phần tử tại id là" + id);
  // });
};
Allproduct.update = (host, data, id, result) => {
  console.log("data", data);
  console.log("id", id);
  let array = {};
  db.query("SELECT * FROM products WHERE id=?", id, (err, allproduct) => {
    if (err) {
      result({
        code: err.errno,
        message: err.message,
      });
    } else if (allproduct.length === 0) result(null);
    else {
      array = {
        ...allproduct[0],
        nameproduct: data.nameproduct
          ? data.nameproduct
          : allproduct[0].nameproduct,
        // srcimg:data.srcimg? data.srcimg :allproduct[0].srcimg,
        status: data.status
          ? JSON.stringify(data.status)
          : allproduct[0].status,
        report: data.report ? data.report : allproduct[0].report,
        type: data.type ? JSON.stringify(data.type) : allproduct[0].type,
        quantitys: data.quantitys ? data.quantitys : allproduct[0].quantitys,
        update_at: nowDate(),
        price: data.price ? data.price : allproduct[0].price,
        expirationdate: data.expirationdate
          ? data.expirationdate
          : allproduct[0].expirationdate,
        tag: data.tag ? data.tag : allproduct[0].tag,
        description: data.description
          ? data.description
          : allproduct[0].description,
      };
      console.log("array", array);
      db.query(
        "UPDATE products SET nameproduct=?,srcimg=?,status=?, description=?,price=?,create_at=?,update_at=?,productid=?,report=?,quantitys=?,expirationdate=?,tag=?,productid=? WHERE id=?",
        [
          array.nameproduct,
          array.srcimg,
          array.status,
          array.description,
          array.price,
          array.create_at,
          array.update_at,
          array.productid,
          array.report,
          array.quantitys,
          array.expirationdate,
          array.tag,
          array.productid,
          id,
        ],
        (err, allproduct) => {
          if (err) {
            result({
              code: err.errno,
              errorMessage: err.message,
            });
          } else result({ id: id, ...array });
        }
      );
    }
  });
};

module.exports = Allproduct;
