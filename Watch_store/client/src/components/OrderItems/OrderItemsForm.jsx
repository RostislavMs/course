// client/src/components/OrderItems/OrderItemsForm.jsx
import React, { useState, useEffect } from "react";

const OrderItemsForm = ({ orderItem, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    order_id: "",
    watch_id: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (orderItem) {
      setFormData(orderItem);
    } else {
      setFormData({
        order_id: "",
        watch_id: "",
        quantity: "",
        price: "",
      });
    }
  }, [orderItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data being sent:", formData);
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{orderItem ? "Edit Order Item" : "Add Order Item"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Id замовлення:
            <input
              type="number"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Id годинника:
            <input
              type="number"
              name="watch_id"
              value={formData.watch_id}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ціна:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
            />
          </label>
          <label>
            Кількість:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="primary-btn">
            Зберегти
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderItemsForm;
