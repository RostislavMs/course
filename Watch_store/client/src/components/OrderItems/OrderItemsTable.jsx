// client/src/components/OrderItems/OrderItemsTable.jsx
import React from "react";

const OrderItemsTable = ({ orderItems, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Номер</th>
          <th>Id елемента</th>
          <th>Id замовлення</th>
          <th>Id годинника</th>
          <th>Кількість</th>
          <th>Ціна</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, index) => (
          <tr key={item.order_item_id}>
            <td>{index + 1}</td>
            <td>{item.order_item_id}</td>
            <td>{item.order_id}</td>
            <td>{item.watch_id}</td>
            <td>{item.quantity}</td>
            <td>{item.price}</td>
            <td>
              <button onClick={() => onEdit(item)}>Редагувати</button>
              <button onClick={() => onDelete(item.order_item_id)}>
                Видалити
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderItemsTable;
