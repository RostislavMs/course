//server/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const watchesRoutes = require("./routes/watches");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const orderItemsRoutes = require("./routes/orderItems");
const categoriesRoutes = require("./routes/categories");
const watchCategoriesRoutes = require("./routes/watchCategories");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(helmet());

app.use("/api/watches", watchesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/watchCategories", watchCategoriesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
