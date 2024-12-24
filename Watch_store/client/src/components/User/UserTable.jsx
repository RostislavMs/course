// client/src/components/User/UserTable.jsx
import React from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Номер</th>
          <th>ID користувача</th>
          <th>Ім'я</th>
          <th>Електронна пошта</th>
          <th>Статус</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.user_id}>
            <td>{index + 1}</td>
            <td>{user.user_id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>Редагувати</button>
              <button onClick={() => onDelete(user.user_id)}>Видалити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
