const { Carts } = require('../models/carts');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { ProductsInCart } = require('../models/productsIncart');
const { Users } = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

dotenv.config({ path: './config.env' });

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new AppError(400, 'Complete all datas'));
  }
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const newUser = await Users.create({
    username,
    email,
    password: encryptedPassword
  });
  newUser.password = undefined;
  res.status(201).json({
    status: 'sucess',
    data: newUser
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email, status: 'active' } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'E-mail or password invalid'));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'sucess',
    data: token
  });
});

exports.getProductsMe = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const myProductsCreated = await Products.findAll({ where: { userId: id } });
  res.status(201).json({
    status: 'sucess',
    data: myProductsCreated
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const { id } = req.params;
  let userUpdated;

  if (password) {
    const salt = await bcrypt.genSalt(12);
    const newEncryptedPassword = await bcrypt.hash(password, salt);
    userUpdated = {
      username,
      email,
      password: newEncryptedPassword
    };
  } else {
    userUpdated = {
      username,
      email
    };
  }

  const userToUpdate = await Users.findOne({ where: { id } });

  if (!userToUpdate) {
    return next(new AppError(400, 'User does not exist'));
  }
  await userToUpdate.update({ ...userUpdated });
  res.status(201).json({
    status: 'sucess',
    message: 'User updated'
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const userToDelete = await Users.findOne({ where: { id, status: 'active' } });
  if (!userToDelete) {
    return next(new AppError(400, 'User does exist'));
  }

  await userToDelete.update({ status: 'deleted' });

  res.status(201).json({
    status: 'sucess',
    message: 'User deleted'
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const myOrders = await Orders.findAll({ where: { userId: id } });
  res.status(201).json({
    status: 'sucess',
    data: myOrders
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId = id } = req.currentUser;

  const myOrderById = await Orders.findAll({ where: { userId, id } });
  if (!myOrderById) {
    return next(new AppError(400, 'Order doest exist'));
  }
  res.status(201).json({
    status: 'sucess',
    data: myOrderById
  });
});
