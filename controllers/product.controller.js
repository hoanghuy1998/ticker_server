const Allproduct = require("../modules/product.module");
const x = require("../returnAPI");
const payload = x.payload;
exports.getAllProduct = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.get_all(host, (datas) => payload(res, datas));
};
exports.allproduct_detail = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.getById(host, req.params.id, (reqnse) => payload(res, reqnse));
};
exports.getProductQuery = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.getByParam(host, req.query, (reqnse) => payload(res, reqnse));
};
exports.getProductFilterQuery = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.productFilterQuery(host, req.query, (reqnse) =>
    payload(res, reqnse)
  );
};
exports.getProductSortQuery = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.productSortQuery(host, req.query, (reqnse) =>
    payload(res, reqnse)
  );
};
exports.getProductFullSearchQuery = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.productFullSearchQuery(host, req.query, (reqnse) =>
    payload(res, reqnse)
  );
};
exports.getProductFullSearch = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.getFullSearch(host, req.query, (reqnse) => payload(res, reqnse));
};
exports.getProductPaging = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.getPaging(host, req.query, (reqnse) => payload(res, reqnse));
};
exports.getProductPagingAndSearch = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.getPagingSearch(host, req.query, (reqnse) => payload(res, reqnse));
};
exports.add_allproduct = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.create(host, req.body, (reqnse) => payload(res, reqnse));
};
exports.update_allproduct = (req, res) => {
  const host = req.protocol + "://" + req.get("Host") + "/data/";
  Allproduct.update(host, req.body, req.params.id, (reqnse) =>
    payload(res, reqnse)
  );
};
exports.remove_allproduct = (req, res) => {
  Allproduct.remove(req.params.id, (reqnse) => payload(res, reqnse));
};
