// src/components/User/UserForm.js
import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "",
      });
    }
  }, [user]);

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
        <h2>{user ? "Редагувати користувача" : "Додати користувача"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Ім'я користувача:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Пароль:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Електронна пошта:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Роль:
            <input
              type="text"
              name="role"
              value={formData.role}
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

export default UserForm;
