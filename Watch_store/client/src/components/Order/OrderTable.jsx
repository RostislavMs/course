//client/src/components/Order/OrderTable.jsx
import React from "react";

const OrderTable = ({ orders, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Номер</th>
          <th>ID замовлення</th>
          <th>ID користувача</th>
          <th>Дата замовлення</th>
          <th>Загальна вартість</th>
          <th>Статус</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={order.order_id}>
            <td>{index + 1}</td>
            <td>{order.order_id}</td>
            <td>{order.user_id}</td>
            <td>{order.order_date}</td>
            <td>{order.total_amount}</td>
            <td>{order.status}</td>
            <td>
              <button onClick={() => onEdit(order)}>Редагувати</button>
              <button onClick={() => onDelete(order.order_id)}>Видалити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
