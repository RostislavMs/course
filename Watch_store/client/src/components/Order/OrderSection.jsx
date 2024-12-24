//client/src/components/Order/OrderSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderTable from "./OrderTable";
import OrderForm from "./OrderForm";

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderStatus: "",
    totalAmountFrom: "",
    totalAmountTo: "",
    userIdFilter: "",
    orderDateFrom: "",
    orderDateTo: "",
  });
  const [sortOrder, setSortOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [filters, sortOrder]);

  const loadOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        params: {
          ...filters,
          totalAmountFrom: filters.totalAmountFrom
            ? Number(filters.totalAmountFrom)
            : undefined,
          totalAmountTo: filters.totalAmountTo
            ? Number(filters.totalAmountTo)
            : undefined,
          userId: filters.userIdFilter
            ? Number(filters.userIdFilter)
            : undefined,
          sortOrder: sortOrder || undefined,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error(
        "Помилка при отриманні замовлень:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddOrUpdateOrder = async (order) => {
    try {
      if (selectedOrder) {
        await axios.put(
          `http://localhost:5000/api/orders/${selectedOrder.order_id}`,
          {
            userId: order.userId,
            totalAmount: parseFloat(order.totalAmount),
            status: order.status,
            orderDate: order.orderDate,
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/orders", {
          userId: order.userId,
          totalAmount: parseFloat(order.totalAmount),
          status: order.status,
          orderDate: order.orderDate,
        });
      }
      setOrderModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      console.error("Помилка при збереженні замовлення:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      setOrders(orders.filter((order) => order.order_id !== id));
    } catch (error) {
      console.error("Помилка при видаленні замовлення:", error);
    }
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setOrderModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div>
      <button className="btn-add" onClick={handleAddOrder}>
        Додати нове замовлення
      </button>
      <details>
        <summary className="sort-title">Сортування</summary>
        <div className="filters">
          <label>
            Статус:
            <select
              value={filters.orderStatus}
              onChange={(e) =>
                handleFilterChange("orderStatus", e.target.value)
              }
            >
              <option value="">Всі</option>
              <option value="completed">Виконано</option>
              <option value="pending">Очікується</option>
              <option value="cancelled">Скасовано</option>
            </select>
          </label>
          <label>
            Загальна вартість (від):
            <input
              type="number"
              placeholder="Від..."
              value={filters.totalAmountFrom}
              onChange={(e) =>
                handleFilterChange("totalAmountFrom", e.target.value)
              }
            />
          </label>
          <label>
            Загальна вартість (до):
            <input
              type="number"
              placeholder="До..."
              value={filters.totalAmountTo}
              onChange={(e) =>
                handleFilterChange("totalAmountTo", e.target.value)
              }
            />
          </label>
          <label>
            ID користувача:
            <input
              type="text"
              placeholder="ID користувача"
              value={filters.userIdFilter}
              onChange={(e) =>
                handleFilterChange("userIdFilter", e.target.value)
              }
            />
          </label>
          <label>
            Дата замовлення (від):
            <input
              type="date"
              value={filters.orderDateFrom}
              onChange={(e) =>
                handleFilterChange("orderDateFrom", e.target.value)
              }
            />
          </label>
          <label>
            Дата замовлення (до):
            <input
              type="date"
              value={filters.orderDateTo}
              onChange={(e) =>
                handleFilterChange("orderDateTo", e.target.value)
              }
            />
          </label>
          <label>
            Сортування за ціною:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Не сортувати</option>
              <option value="asc">За зростанням</option>
              <option value="desc">За спаданням</option>
            </select>
          </label>
        </div>
      </details>

      <OrderTable
        orders={orders}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
      />
      {isOrderModalOpen && (
        <OrderForm
          order={selectedOrder}
          onSave={handleAddOrUpdateOrder}
          onClose={() => setOrderModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderSection;
