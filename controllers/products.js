const { Carts } = require('../models/carts');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { ProductsInCart } = require('../models/productsIncart');
const { Users } = require('../models/users');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, userId } = req.body;
  if (!title || !description || !quantity || !price || !userId) {
    return next(new AppError(400, 'Complete all datas'));
  }
  const newProduct = await Products.create({
    title,
    description,
    quantity,
    price,
    userId
  });
  res.status(201).json({
    status: 'sucess',
    data: newProduct
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Products.findAll({
    where: { status: 'active' },
    include: [{ model: Users, attributes: { exclude: ['password'] } }]
  });
  res.status(201).json({
    status: 'succes',
    data: products
  });
});

exports.getProductsById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Products.findOne({
    where: { status: 'active', id },
    include: [{ model: Users, attributes: { exclude: ['password'] } }]
  });
  if (!product) {
    return next(new AppError(400, 'Product does not exist'));
  }
  res.status(201).json({
    status: 'succes',
    data: product
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, quantity, price, userId } = req.body;
  const productUpdate = {
    title,
    description,
    quantity,
    price,
    userId
  };
  const productToUpdate = await Products.findOne({
    where: { status: 'active', id }
  });
  if (!productToUpdate) {
    return next(new AppError(400, 'Product does not exist'));
  }
  await productToUpdate.update({ ...productUpdate });
  res.status(201).json({
    status: 'succes',
    message: 'Product updated'
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productToDelete = await Products.findOne({
    where: { status: 'active', id }
  });
  if (!productToDelete) {
    return next(new AppError(400, 'Product does not exist'));
  }
  await productToDelete.update({ status: 'deleted' });
  res.status(201).json({
    status: 'succes',
    message: 'Product deleted'
  });
});
