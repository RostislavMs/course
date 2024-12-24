//server/routes/watchCategories.js
const express = require("express");
const {
  getWatchCategories,
  addCategoryToWatch,
  removeCategoryFromWatch,
} = require("../controllers/watchCategoriesController");

const router = express.Router();

router.get(
  "/:watch_id",
  (req, res, next) => {
    res.removeHeader("Content-Security-Policy");
    next();
  },
  getWatchCategories
);

router.post("/", addCategoryToWatch);
router.delete("/:watch_id/:category_id", removeCategoryFromWatch);

module.exports = router;
