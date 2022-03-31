const express = require('express');
const route = express.Router();
const { validateSesion } = require('../utils/authSesion');

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsById
} = require('../controllers/products');

route.use(validateSesion);

route.post('/', createProduct);

route.get('/', getAllProducts);

route.get('/:id', getProductsById);

route.patch('/:id', updateProduct);

route.delete('/:id', deleteProduct);

module.exports = { productsRoutes: route };
