//server/controllers/orderItemsController.js
const connectDB = require("../config/db");
const sql = require("mssql");

async function getAllOrderItems(req, res) {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM OrderItems");
    res.json(result.recordset);
  } catch (err) {
    console.error("Помилка при отриманні замовлення:", err);
    res.status(500).json({ error: "Помилка при отриманні замовлення" });
  }
}

async function createOrderItem(req, res) {
  try {
    const { order_id, watch_id, quantity, price } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("order_id", sql.Int, order_id)
      .input("watch_id", sql.Int, watch_id)
      .input("quantity", sql.Int, quantity)
      .input("price", sql.Decimal(18, 2), price)
      .query(
        "INSERT INTO OrderItems (order_id, watch_id, quantity, price) VALUES (@order_id, @watch_id, @quantity, @price)"
      );

    res.status(201).json({ message: "Замовлення успішно створено" });
  } catch (err) {
    console.error("Помилка створення замовлення:", err);
    res.status(500).json({ error: "Помилка створення замовлення" });
  }
}

async function updateOrderItem(req, res) {
  try {
    const { id } = req.params;
    const { order_id, watch_id, quantity, price } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("order_id", sql.Int, order_id)
      .input("watch_id", sql.Int, watch_id)
      .input("quantity", sql.Int, quantity)
      .input("price", sql.Decimal(18, 2), price)
      .query(
        "UPDATE OrderItems SET order_id = @order_id, watch_id = @watch_id, quantity = @quantity, price = @price WHERE order_item_id = @id"
      );

    res.json({ message: "Замовлення успішно оновлено" });
  } catch (err) {
    console.error("Помилка оновлення замовлення:", err);
    res.status(500).json({ error: "Помилка оновлення замовлення" });
  }
}

async function deleteOrderItem(req, res) {
  try {
    const { id } = req.params;

    const pool = await connectDB();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM OrderItems WHERE order_item_id = @id");

    res.json({
      message: `Видалено ${result.rowsAffected} зі списку замовлення`,
    });
  } catch (err) {
    console.error("Помилка видалення замовлення:", err);
    res.status(500).json({ error: "Помилка видалення замовлення" });
  }
}

module.exports = {
  getAllOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
