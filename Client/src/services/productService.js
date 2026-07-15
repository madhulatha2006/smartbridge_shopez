import axios from 'axios';

const API_URL = '/api/products';

const getProducts = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProduct = async (productData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL, productData, config);
  return response.data;
};

const updateProduct = async (id, productData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}/${id}`, productData, config);
  return response.data;
};

const deleteProduct = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
