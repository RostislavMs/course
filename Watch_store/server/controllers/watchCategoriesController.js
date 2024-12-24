//server/controllers/watchCategoriesController.js
const connectDB = require("../config/db");
const sql = require("mssql");

async function getWatchCategories(req, res) {
  try {
    const { watch_id } = req.params;

    if (!watch_id) {
      return res.status(400).json({ error: "Watch ID is required" });
    }

    const pool = await connectDB();
    const result = await pool.request().input("watch_id", sql.Int, watch_id)
      .query(`
        SELECT c.name
        FROM Categories c
        JOIN WatchCategories wc ON c.category_id = wc.category_id
        WHERE wc.watch_id = @watch_id
      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: "No categories found for this watch" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching watch categories:", err);
    res
      .status(500)
      .json({ error: "Error fetching watch categories", details: err.message });
  }
}

async function addCategoryToWatch(req, res) {
  try {
    const { watch_id, category_id } = req.body;

    if (!watch_id || !category_id) {
      return res
        .status(400)
        .json({ error: "Watch ID and Category ID are required" });
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("watch_id", sql.Int, watch_id)
      .input("category_id", sql.Int, category_id).query(`
        INSERT INTO WatchCategories (watch_id, category_id)
        VALUES (@watch_id, @category_id)
      `);

    res.status(201).json({ message: "Category added to watch successfully" });
  } catch (err) {
    console.error("Error adding category to watch:", err);
    res
      .status(500)
      .json({ error: "Error adding category to watch", details: err.message });
  }
}

async function removeCategoryFromWatch(req, res) {
  try {
    const { watch_id, category_id } = req.params;

    if (!watch_id || !category_id) {
      return res
        .status(400)
        .json({ error: "Watch ID and Category ID are required" });
    }

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("watch_id", sql.Int, watch_id)
      .input("category_id", sql.Int, category_id).query(`
        DELETE FROM WatchCategories
        WHERE watch_id = @watch_id AND category_id = @category_id
      `);

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ error: "Category not found for this watch" });
    }

    res.json({ message: "Category removed from watch successfully" });
  } catch (err) {
    console.error("Error removing category from watch:", err);
    res.status(500).json({
      error: "Error removing category from watch",
      details: err.message,
    });
  }
}

module.exports = {
  getWatchCategories,
  addCategoryToWatch,
  removeCategoryFromWatch,
};
