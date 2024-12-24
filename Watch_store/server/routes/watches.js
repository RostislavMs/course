//server/routes/watches.js
const express = require("express");
const {
  getAllWatches,
  createWatch,
  updateWatch,
  deleteWatch,
} = require("../controllers/watchesController");

const router = express.Router();

router.get("/", getAllWatches);
router.post("/", createWatch);
router.put("/:id", updateWatch);
router.delete("/:id", deleteWatch);

module.exports = router;
