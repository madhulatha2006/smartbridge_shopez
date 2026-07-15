import axios from 'axios';

const API_URL = '/api/orders';
const ADMIN_API_URL = '/api/admin';

const createOrder = async (orderData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

const getOrders = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getOrderById = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

const updateOrderStatus = async (id, orderStatus, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${API_URL}/${id}`, { orderStatus }, config);
  return response.data;
};

// Admin Specific Calls
const getAdminDashboard = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${ADMIN_API_URL}/dashboard`, config);
  return response.data;
};

const getAdminOrders = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${ADMIN_API_URL}/orders`, config);
  return response.data;
};

const getAdminConfig = async () => {
  const response = await axios.get(`${ADMIN_API_URL}/config`);
  return response.data;
};

const updateAdminConfig = async (configData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${ADMIN_API_URL}/config`, configData, config);
  return response.data;
};

const orderService = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAdminDashboard,
  getAdminOrders,
  getAdminConfig,
  updateAdminConfig,
};

export default orderService;
