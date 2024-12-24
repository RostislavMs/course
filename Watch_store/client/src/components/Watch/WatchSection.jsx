// client/src/components/Watch/WatchSection.jsx
import React, { useState, useEffect } from "react";
import {
  fetchWatches,
  createWatch,
  updateWatch,
  deleteWatch,
} from "../../services/api";
import WatchTable from "./WatchTable";
import WatchForm from "./WatchForm";

const WatchSection = () => {
  const [watches, setWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // Додаємо стан для сортування
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [isWatchModalOpen, setWatchModalOpen] = useState(false);

  useEffect(() => {
    loadWatches();
    filterWatches();
  }, [searchTerm, brandFilter, priceFilter, stockFilter, watches, sortOrder]);

  const loadWatches = async () => {
    const filters = {
      name: searchTerm || undefined,
      brand: brandFilter || undefined,
      minPrice: priceFilter.min || undefined,
      maxPrice: priceFilter.max || undefined,
      minStock: stockFilter || undefined,
      sortOrder: sortOrder || undefined, // Передаємо тип сортування
    };

    const data = await fetchWatches(filters);
    setWatches(data);
  };

  const filterWatches = () => {
    let filtered = [...watches];

    if (searchTerm) {
      filtered = filtered.filter((watch) =>
        watch.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (brandFilter) {
      filtered = filtered.filter((watch) =>
        watch.brand.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }
    if (priceFilter.min || priceFilter.max) {
      filtered = filtered.filter(
        (watch) =>
          (!priceFilter.min || watch.price >= parseFloat(priceFilter.min)) &&
          (!priceFilter.max || watch.price <= parseFloat(priceFilter.max))
      );
    }
    if (stockFilter) {
      filtered = filtered.filter(
        (watch) => watch.stock_quantity >= parseInt(stockFilter, 10)
      );
    }

    // Локальне сортування (резервне, якщо серверне недоступне)
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredWatches(filtered);
  };

  const handleAddOrUpdateWatch = async (watch) => {
    try {
      if (selectedWatch) {
        await updateWatch(selectedWatch.watch_id, watch);
      } else {
        await createWatch(watch);
      }

      setWatchModalOpen(false);
      setSelectedWatch(null);
      loadWatches();
    } catch (error) {
      console.error("Помилка збереження годинника:", error);
    }
  };

  const handleDeleteWatch = async (id) => {
    try {
      await deleteWatch(id);
      setWatches(watches.filter((watch) => watch.watch_id !== id));
    } catch (error) {
      console.error("Помилка видалення годинника:", error);
    }
  };

  const handleAddWatch = () => {
    setSelectedWatch(null);
    setWatchModalOpen(true);
  };

  const handleEditWatch = (watch) => {
    setSelectedWatch(watch);
    setWatchModalOpen(true);
  };

  return (
    <div>
      <button className="btn-add" onClick={handleAddWatch}>
        Додати новий годинник
      </button>
      <details>
        <summary className="sort-title">Сортування</summary>
        <div className="filters">
          <label>
            Пошук за назвою:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <label>
            Бренд:
            <input
              type="text"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            />
          </label>
          <label>
            Ціна:
            <input
              type="number"
              placeholder="Від"
              value={priceFilter.min}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, min: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="До"
              value={priceFilter.max}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, max: e.target.value })
              }
            />
          </label>
          <label>
            Кількість у наявності (від):
            <input
              type="number"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            />
          </label>
          <label>
            Сортувати за ціною:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Без сортування</option>
              <option value="asc">За зростанням</option>
              <option value="desc">За спаданням</option>
            </select>
          </label>
        </div>
      </details>
      <WatchTable
        watches={filteredWatches}
        onEdit={handleEditWatch}
        onDelete={handleDeleteWatch}
      />
      {isWatchModalOpen && (
        <WatchForm
          watch={selectedWatch}
          onSave={handleAddOrUpdateWatch}
          onClose={() => setWatchModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WatchSection;
