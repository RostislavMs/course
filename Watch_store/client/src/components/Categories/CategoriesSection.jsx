import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import debounce from "lodash.debounce";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, [nameFilter]);

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const filters = {
        searchTerm: nameFilter || undefined,
      };
      const data = await fetchCategories(filters);
      setCategories(data);
      if (data.length === 0) setErrorMessage("Нічого не знайдено.");
    } catch (error) {
      setErrorMessage("Помилка завантаження категорій.");
      console.error("Помилка при отриманні категорій:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = debounce((value) => {
    setNameFilter(value);
  }, 300);

  const handleAddOrUpdateCategory = async (category) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.category_id, category);
      } else {
        await createCategory(category);
      }
      setCategoryModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error("Категорія збереження помилок:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(
        categories.filter((category) => category.category_id !== id)
      );
    } catch (error) {
      console.error("Помилка видалення категорії:", error);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  return (
    <div>
      <button className="btn-add" onClick={handleAddCategory}>
        Додати нову категорію
      </button>
      <div className="filters">
        <label>
          Пошук за назвою:
          <input
            type="text"
            placeholder="Введіть назву"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </label>
      </div>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryForm
          category={selectedCategory}
          onSave={handleAddOrUpdateCategory}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoriesSection;
