// client/src/components/Categories/CategoriesTable.jsx
import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Номер</th>
          <th>Id Категорії</th>
          <th>Назва</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={category.category_id}>
            <td>{index + 1}</td>
            <td>{category.category_id}</td>
            <td>{category.category_name}</td>
            <td>
              <button onClick={() => onEdit(category)}>Редагувати</button>
              <button onClick={() => onDelete(category.category_id)}>
                Видалити
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
