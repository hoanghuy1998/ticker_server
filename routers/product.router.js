const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const upload = multer({
  dest: "temp/",
  limit: { fileSize: maxSize },
});
module.exports = (router) => {
  const allproduct = require("../controllers/product.controller");
  router.get("/all", allproduct.getAllProduct);
  router.get("/all/filter", allproduct.getProductQuery);
  router.get("/all/filterQuery", allproduct.getProductFilterQuery);
  router.get("/all/filterSortQuery", allproduct.getProductSortQuery);
  router.get("/all/fullSearch", allproduct.getProductFullSearch);
  router.get("/all/fullSearchQuery", allproduct.getProductFullSearchQuery);
  router.get("/all/get-paging", allproduct.getProductPaging);
  router.get("/all/searchAndGet-paging", allproduct.getProductPagingAndSearch);
  router.get("/all/:id", allproduct.allproduct_detail);
  // router.post("/allproduct/list",upload.single('srcImg'),upload.array('imgDescription',20) , allproduct.add_allproduct);
  router.post(
    "/all",
    upload.fields([
      { name: "srcImg", maxCount: 1 },
      { name: "imgDescription", maxCount: 20 },
    ]),
    allproduct.add_allproduct
  );
  router.put("/all/:id", allproduct.update_allproduct);
  router.delete("/all/:id", allproduct.remove_allproduct);
};
