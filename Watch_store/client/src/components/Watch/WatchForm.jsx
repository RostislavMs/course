// client/src/components/Watch/WatchForm.jsx
import React, { useState, useEffect } from "react";

const WatchForm = ({ watch, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock_quantity: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    if (watch) {
      setFormData(watch);
    } else {
      setFormData({
        name: "",
        brand: "",
        price: "",
        stock_quantity: "",
        description: "",
        image_url: "",
      });
    }
  }, [watch]);

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
        <h2>{watch ? "Редагувати годинник" : "Додати новий годинник"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Назва:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Бренд:
            <input
              type="text"
              name="brand"
              value={formData.brand}
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
            />
          </label>
          <label>
            Кількість у наявності:
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Опис:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </label>
          <label>
            Шлях до картинки:
            <input
              type="text"
              name="image_url"
              value={formData.image_url || " "}
              onChange={handleChange}
              placeholder="e.g., images/image1.jpg"
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

export default WatchForm;
