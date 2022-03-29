const express = require('express');
const route = express.Router();

const {
  createAddProductInCart,
  updateProductCart,
  deleteProductCart,
  purchaseProuctCart
} = require('../controllers/carts');

route.post('/add-product', createAddProductInCart);

route.patch('/update-cart', updateProductCart);

route.delete('/:productId', deleteProductCart);

route.post('/purchase', purchaseProuctCart);

module.exports = { cartsRoutes: route };
