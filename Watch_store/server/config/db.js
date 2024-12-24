//server/config/db.js
const sql = require("mssql");
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("Підключення до SQL Server");
    return pool;
  } catch (err) {
    console.error("Не вдалося з'єднатися з базою даних:", err);
    throw err;
  }
}

module.exports = connectDB;
