//server/controllers/usersControler.js
const connectDB = require("../config/db");
const sql = require("mssql");

async function getAllUsers(req, res) {
  try {
    const { username = "", email = "", role = "" } = req.query;

    const pool = await connectDB();
    const request = pool.request();

    request.input("username", sql.VarChar, `%${username}%`);
    request.input("email", sql.VarChar, `%${email}%`);

    if (role) {
      request.input("role", sql.VarChar, role.toLowerCase());
    } else {
      request.input("role", sql.VarChar, "%");
    }

    const query = `
      SELECT * FROM Users
      WHERE 
        username LIKE @username AND
        email LIKE @email AND
        (@role = '%' OR LOWER(role) = @role)
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Помилка при отриманні користувачів:", err);
    res.status(500).json({ error: "Помилка при отриманні користувачів" });
  }
}

async function createUser(req, res) {
  try {
    const { username, password, email, role } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("email", sql.VarChar, email)
      .input("role", sql.VarChar, role)
      .query(
        `INSERT INTO Users (username, password, email, role) 
         VALUES (@username, @password, @email, @role)`
      );

    res.status(201).json({ message: "Користувача успішно створено" });
  } catch (err) {
    console.error("Помилка створення користувача:", err);
    res.status(500).json({ error: "Помилка створення користувача" });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, password, email, role } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("email", sql.VarChar, email)
      .input("role", sql.VarChar, role).query(`
        UPDATE Users
        SET username = @username, password = @password, email = @email, role = @role
        WHERE user_id = @id
      `);

    res.json({ message: "Користувача успішно оновлено" });
  } catch (err) {
    console.error("Помилка оновлення користувача:", err);
    res.status(500).json({ error: "Помилка оновлення користувача" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const pool = await connectDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Users WHERE user_id = @id");

    res.json({ message: "Користувача успішно видалено" });
  } catch (err) {
    console.error("Помилка видалення користувача:", err);
    res.status(500).json({ error: "Помилка видалення користувача" });
  }
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
