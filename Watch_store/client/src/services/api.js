//client/src/services/api.js
import axios from "axios";

const API_URL_Watch =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/watches";

const API_URL_Categories = "http://localhost:5000/api/categories";
export const fetchWatches = async (filters = {}) => {
  try {
    const query = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query.append(key, filters[key]);
      }
    });
    const response = await axios.get(`${API_URL_Watch}?${query.toString()}`);

    return response.data;
  } catch (err) {
    console.error("Error fetching watches:", err);
    throw err;
  }
};

export const createWatch = async (watchData) => {
  try {
    const response = await axios.post(API_URL_Watch, watchData);
    return response.data;
  } catch (err) {
    console.error("Error creating watch:", err);
    throw err;
  }
};

export const updateWatch = async (id, watchData) => {
  try {
    const response = await axios.put(`${API_URL_Watch}/${id}`, watchData);
    return response.data;
  } catch (err) {
    console.error("Error updating watch:", err);
    throw err;
  }
};

export const deleteWatch = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_Watch}/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting watch:", err);
    throw err;
  }
};

// Categories
export const fetchCategories = async (filters = {}) => {
  try {
    const query = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query.append(key, filters[key]);
      }
    });
    const response = await axios.get(
      `${API_URL_Categories}?${query.toString()}`
    );
    return response.data;
  } catch (err) {
    console.error("Помилка завантаження категорій:", err);
    throw err;
  }
};

export const createCategory = async (category) => {
  await axios.post(API_URL_Categories, category);
};

export const updateCategory = async (id, category) => {
  await axios.put(`${API_URL_Categories}/${id}`, category);
};

export const deleteCategory = async (id) => {
  await axios.delete(`${API_URL_Categories}/${id}`);
};
