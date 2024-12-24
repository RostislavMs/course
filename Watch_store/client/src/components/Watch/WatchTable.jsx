// client/src/components/Watch/WatchTable.jsx
import React from "react";

const WatchTable = ({ watches, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Номер</th>
          <th>ID годинника</th>
          <th>Назва</th>
          <th>Бренд</th>
          <th>Ціна</th>
          <th>Кількість у наявності</th>
          <th>Опис</th>
          <th>Шлях до картинки</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {watches.map((watch, index) => (
          <tr key={watch.watch_id}>
            <td>{index + 1}</td>
            <td>{watch.watch_id}</td>
            <td>{watch.name}</td>
            <td>{watch.brand}</td>
            <td>{watch.price}</td>
            <td>{watch.stock_quantity}</td>
            <td>{watch.description}</td>
            <td>{watch.image_url}</td>
            <td>
              <button onClick={() => onEdit(watch)}>Редагувати</button>
              <button onClick={() => onDelete(watch.watch_id)}>Видалити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WatchTable;
