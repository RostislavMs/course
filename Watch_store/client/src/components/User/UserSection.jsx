// client/src/components/User/UserSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import UserForm from "./UserForm";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [searchUsername, searchEmail, searchRole]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesUsername = user.username
        .toLowerCase()
        .includes(searchUsername.toLowerCase());
      const matchesEmail = user.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const normalizedRole = user.role.toLowerCase();
      const matchesRole =
        searchRole === "" ||
        normalizedRole.includes(searchRole.toLowerCase()) ||
        (normalizedRole === "admin" && searchRole.toLowerCase() === "адмін") ||
        (normalizedRole === "customer" &&
          searchRole.toLowerCase() === "користувач");

      return matchesUsername && matchesEmail && matchesRole;
    });

    setFilteredUsers(filtered);
  }, [searchUsername, searchEmail, searchRole, users]);

  const loadUsers = async () => {
    try {
      const query = new URLSearchParams();
      if (searchUsername) query.append("username", searchUsername);
      if (searchEmail) query.append("email", searchEmail);
      if (searchRole) {
        if (searchRole === "користувач") {
          query.append("role", "customer");
        } else if (searchRole === "адмін") {
          query.append("role", "admin");
        }
      }

      const response = await axios.get(
        `http://localhost:5000/api/users?${query.toString()}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Помилка при отриманні користувачів:", error);
    }
  };

  const handleAddOrUpdateUser = async (user) => {
    try {
      if (selectedUser) {
        await axios.put(
          `http://localhost:5000/api/users/${selectedUser.user_id}`,
          user
        );
      } else {
        await axios.post("http://localhost:5000/api/users", user);
      }
      setUserModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error("Помилка збереження користувача:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user.user_id !== id));
    } catch (error) {
      console.error("Помилка видалення користувача:", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  return (
    <div>
      <button className="btn-add" onClick={handleAddUser}>
        Додати нового користувача
      </button>
      <details>
        <summary className="sort-title">Сортування</summary>
        <div className="filters">
          <label>
            Пошук за іменем:
            <input
              type="text"
              placeholder="Введіть ім'я..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
          </label>
          <label>
            Пошук за електронною поштою:
            <input
              type="text"
              placeholder="Введіть електронну пошту..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </label>
          <label>
            Фільтр за статусом:
            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
            >
              <option value="">Всі</option>
              <option value="користувач">Користувач</option>
              <option value="адмін">Адмін</option>
            </select>
          </label>
        </div>
      </details>

      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
      {isUserModalOpen && (
        <UserForm
          user={selectedUser}
          onSave={handleAddOrUpdateUser}
          onClose={() => setUserModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserSection;
