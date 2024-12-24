//server/controllers/watchesController.js
const connectDB = require("../config/db");
const sql = require("mssql");

async function getAllWatches(req, res) {
  try {
    const {
      searchTerm = "",
      brandFilter = "",
      minPrice,
      maxPrice,
      minStock,
    } = req.query;

    const pool = await connectDB();
    const request = pool.request();

    if (searchTerm) {
      request.input("searchTerm", sql.VarChar, `%${searchTerm}%`);
    }
    if (brandFilter) {
      request.input("brandFilter", sql.VarChar, `%${brandFilter}%`);
    }
    if (minPrice && !isNaN(minPrice)) {
      request.input("minPrice", sql.Decimal(18, 2), parseFloat(minPrice));
    }
    if (maxPrice && !isNaN(maxPrice)) {
      request.input("maxPrice", sql.Decimal(18, 2), parseFloat(maxPrice));
    }
    if (minStock && !isNaN(minStock)) {
      request.input("minStock", sql.Int, parseInt(minStock, 10));
    }

    let query = `
      SELECT * FROM Watches
      WHERE 1 = 1
    `;

    if (searchTerm) {
      query += " AND name LIKE @searchTerm";
    }
    if (brandFilter) {
      query += " AND brand LIKE @brandFilter";
    }
    if (minPrice) {
      query += " AND price >= @minPrice";
    }
    if (maxPrice) {
      query += " AND price <= @maxPrice";
    }
    if (minStock) {
      query += " AND stock_quantity >= @minStock";
    }
    if (req.query.sortOrder === "asc") {
      query += " ORDER BY price ASC";
    } else if (req.query.sortOrder === "desc") {
      query += " ORDER BY price DESC";
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Помилка при отриманні годинника:", err);
    res.status(500).json({ error: "Помилка при отриманні годинника" });
  }
}

async function createWatch(req, res) {
  try {
    const { name, brand, price, stock_quantity, description, image_url } =
      req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("brand", sql.VarChar, brand)
      .input("price", sql.Decimal(18, 2), price)
      .input("stock_quantity", sql.Int, stock_quantity)
      .input("description", sql.VarChar, description)
      .input("image_url", sql.VarChar, image_url)
      .query(
        `INSERT INTO Watches (name, brand, price, stock_quantity, description, image_url) 
         VALUES (@name, @brand, @price, @stock_quantity, @description, @image_url)`
      );

    res.status(201).json({ message: "Годинник успішно створено" });
  } catch (err) {
    console.error("Помилка створення годинника:", err);
    res.status(500).json({ error: "Помилка створення годинника" });
  }
}

async function updateWatch(req, res) {
  try {
    const { id } = req.params;
    const { name, brand, price, stock_quantity, description, image_url } =
      req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("brand", sql.VarChar, brand)
      .input("price", sql.Decimal(18, 2), price)
      .input("stock_quantity", sql.Int, stock_quantity)
      .input("description", sql.VarChar, description)
      .input("image_url", sql.VarChar, image_url).query(`
    UPDATE Watches
    SET name = @name, brand = @brand, price = @price, stock_quantity = @stock_quantity, 
        description = @description, image_url = @image_url
    WHERE watch_id = @id
  `);

    res.json({ message: "Годинник успішно оновлено" });
  } catch (err) {
    console.error("Помилка оновлення годинника:", err);
    res.status(500).json({ error: "Помилка оновлення годинника" });
  }
}

async function deleteWatch(req, res) {
  try {
    const { id } = req.params;
    console.log(`Видалення годинника з ідентифікатором: ${id}`);

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Watches WHERE watch_id = @id");

    console.log(`Видалено ${result.rowsAffected} годинник(и)`);
    res.json({ message: `Видалено ${result.rowsAffected} годинник(и)` });
  } catch (err) {
    console.error("Помилка видалення годинника:", err);
    res.status(500).json({ error: "Помилка видалення годинника" });
  }
}

module.exports = { getAllWatches, createWatch, updateWatch, deleteWatch };
