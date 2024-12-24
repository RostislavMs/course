import React, { useState, useEffect } from "react";

const CategoryForm = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({ category_name: "" });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ category_name: "" });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{category ? "Редагувати категорію" : "Додати категорію"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Назва:
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
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

export default CategoryForm;
