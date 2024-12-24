const connectDB = require("../config/db");
const sql = require("mssql");

async function getAllCategories(req, res) {
  try {
    const { searchTerm = "" } = req.query;

    const pool = await connectDB();
    const request = pool.request();

    request.input(
      "searchTerm",
      sql.NVarChar,
      searchTerm ? `%${searchTerm}%` : null
    );

    const query = `
      SELECT * FROM Categories
      WHERE @searchTerm IS NULL OR category_name LIKE @searchTerm
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Помилка відображення категорій:", err);
    res.status(500).json({ error: "Помилка відображення категорій" });
  }
}

async function createCategory(req, res) {
  try {
    const { category_name } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("name", sql.NVarChar, category_name)
      .query("INSERT INTO Categories (category_name) VALUES (@name)");

    res.status(201).json({ message: "Категорію створено успішно" });
  } catch (err) {
    console.error("Помилка створення категорії:", err);
    res.status(500).json({ error: "Помилка створення категорії" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, category_name)
      .query(
        "UPDATE Categories SET category_name = @name WHERE category_id = @id"
      );

    res.json({ message: "Категорію успішно оновлено" });
  } catch (err) {
    console.error("Категорія помилки оновлення:", err);
    res.status(500).json({ error: "Категорія помилки оновлення" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Categories WHERE category_id = @id");

    res.json({ message: "Категорію успішно видалено" });
  } catch (err) {
    console.error("Помилка видалення категорії:", err);
    res.status(500).json({ error: "Помилка видалення категорії" });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
