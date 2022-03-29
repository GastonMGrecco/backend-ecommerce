const { Carts } = require('../models/carts');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { Users } = require('../models/users');
const { ProductsInCart } = require('../models/productsIncart');

const Relationships = () => {
  Users.hasMany(Orders);
  Orders.belongsTo(Users);

  Users.hasMany(Products);
  Products.belongsTo(Users);

  Users.hasOne(Carts);
  Carts.belongsTo(Users);

  Carts.hasOne(Orders);
  Orders.belongsTo(Carts);

  Carts.hasMany(ProductsInCart);
  ProductsInCart.belongsTo(Carts);

  ProductsInCart.hasOne(Products);
  Products.belongsTo(ProductsInCart);
};
module.exports = { Relationships };
