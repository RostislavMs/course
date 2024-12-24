//client/src/App.js
import React, { useState } from "react";
import "./css/Modal.css";
import "./css/Table.css";
import "./css/App.css";

import WatchSection from "./components/Watch/WatchSection";
import UserSection from "./components/User/UserSection";
import OrderSection from "./components/Order/OrderSection";
import OrderItemsSection from "./components/OrderItems/OrderItemsSection";
import CategoriesSection from "./components/Categories/CategoriesSection";

const App = () => {
  const [currentTable, setCurrentTable] = useState("watches");

  return (
    <div className="app-container">
      <h1>База даних годинників</h1>
      <div>
        <button onClick={() => setCurrentTable("watches")}>Годинники</button>
        <button onClick={() => setCurrentTable("users")}>Користувачі</button>
        <button onClick={() => setCurrentTable("orders")}>Замовлення</button>
        <button onClick={() => setCurrentTable("orderItems")}>
          Список замовлень
        </button>
        <button onClick={() => setCurrentTable("categories")}>Категорії</button>
      </div>

      {currentTable === "watches" && <WatchSection />}
      {currentTable === "users" && <UserSection />}
      {currentTable === "orders" && <OrderSection />}
      {currentTable === "orderItems" && <OrderItemsSection />}
      {currentTable === "categories" && <CategoriesSection />}
    </div>
  );
};

export default App;
