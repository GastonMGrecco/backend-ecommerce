const express = require('express');
const route = express.Router();
const { validateSesion } = require('../utils/authSesion');
const { createProductValidations } = require('../utils/validators');
const { validateResult } = require('../utils/validators');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsById
} = require('../controllers/products');

route.use(validateSesion);

route.post('/', createProductValidations, validateResult, createProduct);

route.get('/', getAllProducts);

route.get('/:id', getProductsById);

route.patch('/:id', updateProduct);

route.delete('/:id', deleteProduct);

module.exports = { productsRoutes: route };
