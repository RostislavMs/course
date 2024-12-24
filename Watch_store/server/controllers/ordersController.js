// server/controllers/ordersController.js
const connectDB = require("../config/db");
const sql = require("mssql");

async function getAllOrders(req, res) {
  try {
    const {
      status,
      totalAmountFrom,
      totalAmountTo,
      userId,
      orderDateFrom,
      orderDateTo,
      sortOrder,
    } = req.query;

    const pool = await connectDB();
    const request = pool.request();

    if (status) request.input("status", sql.VarChar, status);
    if (totalAmountFrom)
      request.input(
        "totalAmountFrom",
        sql.Decimal(18, 2),
        parseFloat(totalAmountFrom)
      );
    if (totalAmountTo)
      request.input(
        "totalAmountTo",
        sql.Decimal(18, 2),
        parseFloat(totalAmountTo)
      );
    if (userId) request.input("userId", sql.Int, parseInt(userId, 10));
    if (orderDateFrom)
      request.input("orderDateFrom", sql.DateTime, new Date(orderDateFrom));
    if (orderDateTo)
      request.input("orderDateTo", sql.DateTime, new Date(orderDateTo));

    let query = `
      SELECT * FROM Orders
      WHERE 1=1
    `;
    if (status) query += " AND status = @status";
    if (totalAmountFrom) query += " AND total_amount >= @totalAmountFrom";
    if (totalAmountTo) query += " AND total_amount <= @totalAmountTo";
    if (userId) query += " AND user_id = @userId";
    if (orderDateFrom) query += " AND order_date >= @orderDateFrom";
    if (orderDateTo) query += " AND order_date <= @orderDateTo";

    if (sortOrder === "asc") query += " ORDER BY total_amount ASC";
    if (sortOrder === "desc") query += " ORDER BY total_amount DESC";

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Помилка при отриманні замовлень:", err);
    res.status(500).json({ error: "Помилка при отриманні замовлень" });
  }
}

async function createOrder(req, res) {
  try {
    const { userId, totalAmount, status, orderDate } = req.body;

    if (!userId || !totalAmount || !status || !orderDate) {
      return res.status(400).json({ error: "Всі поля є обов'язковими" });
    }

    const pool = await connectDB();
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("totalAmount", sql.Decimal(18, 2), totalAmount)
      .input("status", sql.VarChar, status)
      .input("orderDate", sql.DateTime, orderDate).query(`
        INSERT INTO Orders (user_id, total_amount, status, order_date)
        VALUES (@userId, @totalAmount, @status, @orderDate)
      `);

    res.status(201).json({ message: "Замовлення успішно створено" });
  } catch (err) {
    console.error("Помилка створення замовлення:", err);
    res.status(500).json({ error: "Помилка створення замовлення" });
  }
}

async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { userId, totalAmount, status, orderDate } = req.body;
    const pool = await connectDB();

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("userId", sql.Int, userId)
      .input("totalAmount", sql.Decimal(18, 2), totalAmount)
      .input("status", sql.VarChar, status)
      .input("orderDate", sql.DateTime, orderDate).query(`
        UPDATE Orders
        SET user_id = @userId, total_amount = @totalAmount, status = @status, order_date = @orderDate
        WHERE order_id = @id
      `);

    res.status(200).json({ message: "Замовлення успішно оновлено" });
  } catch (err) {
    console.error("Порядок оновлення помилок:", err);
    res.status(500).json({ error: "Порядок оновлення помилок" });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    await pool.request().input("id", sql.Int, id).query(`
      DELETE FROM Orders WHERE order_id = @id
    `);

    res.status(200).json({ message: "Замовлення успішно видалено" });
  } catch (err) {
    console.error("Помилка видалення замовлення:", err);
    res.status(500).json({ error: "Помилка видалення замовлення" });
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
