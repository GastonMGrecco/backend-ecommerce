const express = require('express');
const route = express.Router();
const { validateSesion } = require('../utils/authSesion');
const { addProductToCartValidation } = require('../utils/validators');
const { validateResult } = require('../utils/validators');
const {
  getCart,
  createAddProductInCart,
  updateProductCart,
  deleteProductCart,
  purchaseProuctCart
} = require('../controllers/carts');

route.use(validateSesion);

route.get('/get-cart', getCart);

route.post(
  '/add-product',
  addProductToCartValidation,
  validateResult,
  createAddProductInCart
);

route.patch('/update-cart', updateProductCart);

route.delete('/:productId', deleteProductCart);

route.post('/purchase', purchaseProuctCart);

module.exports = { cartsRoutes: route };
