//client/src/components/Order/OrderForm.jsx
import React, { useState, useEffect } from "react";

const OrderForm = ({ order, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    orderDate: "",
    totalAmount: "",
    status: "",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        userId: order.user_id || "",
        orderDate: order.order_date || "",
        totalAmount: order.total_amount || "",
        status: order.status || "",
      });
    } else {
      setFormData({
        userId: "",
        orderDate: "",
        totalAmount: "",
        status: "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.userId ||
      !formData.orderDate ||
      !formData.totalAmount ||
      !formData.status
    ) {
      alert("Усі поля повинні бути заповнені!");
      return;
    }

    onSave({
      userId: parseInt(formData.userId, 10),
      totalAmount: parseFloat(formData.totalAmount),
      status: formData.status,
      orderDate: formData.orderDate,
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{order ? "Редагувати замовлення" : "Додати нове замовлення"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            ID користувача:
            <input
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Дата замовлення:
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Загальна сума:
            <input
              type="number"
              name="totalAmount"
              step="0.01"
              value={formData.totalAmount}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Статус:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Оберіть статус</option>
              <option value="completed">Виконано</option>
              <option value="pending">Очікується</option>
              <option value="cancelled">Скасовано</option>
            </select>
          </label>
          <button type="submit" className="primary-btn">
            Зберегти
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
