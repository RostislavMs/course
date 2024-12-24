// client/src/components/OrderItems/OrderItemsSection.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderItemsTable from "./OrderItemsTable";
import OrderItemsForm from "./OrderItemsForm";

const OrderItemsSection = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [filteredOrderItems, setFilteredOrderItems] = useState([]);
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [watchIdFilter, setWatchIdFilter] = useState("");
  const [quantityFrom, setQuantityFrom] = useState("");
  const [quantityTo, setQuantityTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [isOrderItemModalOpen, setOrderItemModalOpen] = useState(false);

  useEffect(() => {
    loadOrderItems();
  }, []);

  const loadOrderItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orderitems");
      setOrderItems(response.data);
    } catch (error) {
      console.error("Помилка при отриманні замовлення:", error);
    }
  };

  useEffect(() => {
    const filtered = orderItems.filter((item) => {
      const matchesOrderId =
        orderIdFilter === "" || String(item.order_id).includes(orderIdFilter);

      const matchesWatchId =
        watchIdFilter === "" || String(item.watch_id).includes(watchIdFilter);

      const matchesQuantity =
        (quantityFrom === "" || item.quantity >= Number(quantityFrom)) &&
        (quantityTo === "" || item.quantity <= Number(quantityTo));

      const matchesPrice =
        (priceFrom === "" || item.price >= Number(priceFrom)) &&
        (priceTo === "" || item.price <= Number(priceTo));

      return (
        matchesOrderId && matchesWatchId && matchesQuantity && matchesPrice
      );
    });

    setFilteredOrderItems(filtered);
  }, [
    orderIdFilter,
    watchIdFilter,
    quantityFrom,
    quantityTo,
    priceFrom,
    priceTo,
    orderItems,
  ]);

  const handleAddOrUpdateOrderItem = async (orderItem) => {
    try {
      if (selectedOrderItem) {
        await axios.put(
          `http://localhost:5000/api/orderitems/${selectedOrderItem.order_item_id}`,
          orderItem
        );
      } else {
        await axios.post("http://localhost:5000/api/orderitems", orderItem);
      }
      setOrderItemModalOpen(false);
      setSelectedOrderItem(null);
      loadOrderItems();
    } catch (error) {
      console.error("Помилка збереження замовлення:", error);
    }
  };

  const handleDeleteOrderItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orderitems/${id}`);
      setOrderItems(orderItems.filter((item) => item.order_item_id !== id));
    } catch (error) {
      console.error("Помилка видалення замовлення:", error);
    }
  };

  const handleAddOrderItem = () => {
    setSelectedOrderItem(null);
    setOrderItemModalOpen(true);
  };

  const handleEditOrderItem = (orderItem) => {
    setSelectedOrderItem(orderItem);
    setOrderItemModalOpen(true);
  };

  return (
    <div>
      <button className="btn-add" onClick={handleAddOrderItem}>
        Додати нове замовлення
      </button>
      <details>
        <summary className="sort-title">Сортування</summary>
        <div className="filters">
          <label>
            ID замовлення:
            <input
              type="text"
              placeholder="ID замовлення"
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
            />
          </label>
          <label>
            ID годинника:
            <input
              type="text"
              placeholder="ID годинника"
              value={watchIdFilter}
              onChange={(e) => setWatchIdFilter(e.target.value)}
            />
          </label>
          <label>
            Кількість (від):
            <input
              type="number"
              placeholder="Від..."
              value={quantityFrom}
              onChange={(e) => setQuantityFrom(e.target.value)}
            />
          </label>
          <label>
            Кількість (до):
            <input
              type="number"
              placeholder="До..."
              value={quantityTo}
              onChange={(e) => setQuantityTo(e.target.value)}
            />
          </label>
          <label>
            Ціна (від):
            <input
              type="number"
              placeholder="Від..."
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
            />
          </label>
          <label>
            Ціна (до):
            <input
              type="number"
              placeholder="До..."
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
            />
          </label>
        </div>
      </details>

      <OrderItemsTable
        orderItems={filteredOrderItems}
        onEdit={handleEditOrderItem}
        onDelete={handleDeleteOrderItem}
      />
      {isOrderItemModalOpen && (
        <OrderItemsForm
          orderItem={selectedOrderItem}
          onSave={handleAddOrUpdateOrderItem}
          onClose={() => setOrderItemModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderItemsSection;
