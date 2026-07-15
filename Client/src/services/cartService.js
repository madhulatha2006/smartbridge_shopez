import axios from 'axios';

const API_URL = '/api/cart';

const getCart = async (userId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

const addToCart = async (cartData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`${API_URL}/add`, cartData, config);
  return response.data;
};

const updateCart = async (cartData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}/update`, cartData, config);
  return response.data;
};

const removeFromCart = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${API_URL}/remove/${id}`, config);
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};

export default cartService;
