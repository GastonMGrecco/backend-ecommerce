const express = require('express');
const route = express.Router();
const { validateSesion } = require('../utils/authSesion');

const {
  createNewUser,
  loginUser,
  getProductsMe,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById
} = require('../controllers/users');

route.post('/', createNewUser);

route.post('/login', loginUser);

route.use(validateSesion);

route.get('/me', getProductsMe);

route.patch('/:id', updateUser);

route.delete('/:id', deleteUser);

route.get('/orders', getAllOrders);

route.get('/orders/:id', getOrderById);

module.exports = { usersRoutes: route };
