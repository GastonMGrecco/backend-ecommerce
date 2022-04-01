const { Carts } = require('../models/carts');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { ProductsInCart } = require('../models/productsIncart');
const { Users } = require('../models/users');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

exports.getCart = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const cart = await Carts.findOne({
    where: { status: 'active', userId: id },
    include: [
      {
        model: Products,
        attributes: {
          exclude: [
            'quantity',
            'updatedAt',
            'createdAt',
            'status',
            'userId',
            'price',
            'description',
            'id'
          ]
        }
      }
    ]
  });

  res.status(201).json({
    status: 'sucess',
    data: cart
  });
});

exports.createAddProductInCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, userId } = req.body;
  if (!productId || !quantity || !userId) {
    return next(
      new AppError(400, 'Must provide an cartId,productId and quantity')
    );
  }

  const product = await Products.findOne({
    where: { status: 'active', id: productId }
  });

  const cart = await Carts.findOne({ where: { status: 'active', userId } });

  if (!cart) {
    const cartWhiteUserId = await Carts.create({
      userId
    });
  }
  const newCart = await Carts.findOne({
    where: { status: 'active', userId }
  });
  if (quantity > product.quantity) {
    return next(
      new AppError(
        400,
        'The quantity of the attached product is greater than the quantity of the existing product'
      )
    );
  }

  const productInCart = await ProductsInCart.findOne({ where: { productId } });

  if (productInCart) {
    await productInCart.update({ ...{ status: 'active', quantity } });
  } else {
    await ProductsInCart.create({
      cartId: newCart.id,
      productId,
      quantity
    });
  }

  const newProductsInCart = await ProductsInCart.findOne({
    where: { status: 'active', cartId: newCart.id, productId }
  });
  res.status(201).json({
    status: 'sucess',
    data: { newProductsInCart, newCart }
  });
});

exports.updateProductCart = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  const { quantity, productId } = req.body;

  const updatecart = await Carts.findOne({
    where: { status: 'active', userId: id }
  });

  const product = await Products.findOne({
    where: { status: 'active', id: productId }
  });

  const cart = await ProductsInCart.findOne({
    where: { status: 'active', cartId: updatecart.id, productId }
  });

  if (!cart) {
    return next(new AppError(400, 'Cart does not exist'));
  }
  if (quantity > product.quantity) {
    return next(
      new AppError(
        400,
        'The quantity of the attached product is greater than the quantity of the existing product'
      )
    );
  }
  if (quantity === 0) {
    await cart.update({ ...{ status: 'deleted' } });
  }
  await cart.update({ ...{ quantity } });

  res.status(201).json({
    status: 'sucess',
    message: 'Cart updated',
    data: cart
  });
});

exports.deleteProductCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { cartId } = req.body;

  const cart = await ProductsInCart.findOne({
    where: { status: 'active', cartId, productId }
  });
  if (!cart) {
    return next(new AppError(400, 'Cart does not exist'));
  }

  await cart.update({ ...{ status: 'delete' } });

  res.status(201).json({
    status: 'sucess',
    message: 'Cart updated',
    data: cart
  });
});

exports.purchaseProuctCart = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const product = await Products.findAll({ where: { status: 'active' } });

  const cartUser = await Carts.findOne({
    where: { status: 'active', userId: id }
  });

  const cart = await ProductsInCart.findAll({
    where: { status: 'active', cartId: cartUser.id }
  });
  let totalPrice = 0;
  let price = 0;
  const actualizacion = cart.map(async (product) => {
    const productCreated = await Products.findOne({
      where: { status: 'active', id: product.productId }
    });
    const subtract = productCreated.quantity - product.quantity;
    price = productCreated.price * product.quantity;
    totalPrice = totalPrice + price;
    if (subtract <= 0) {
      productCreated.update({ status: 'deleted', quantity: 0 });
    }
    await product.update({ status: 'purchase' });
    return await productCreated.update({ quantity: subtract });
  });

  const producUpdated = await Promise.all(actualizacion);

  const order = await Orders.create({
    userId: id,
    cartId: cartUser.id,
    issuedAt: 'algo',
    totalPrice: totalPrice
  });

  await cartUser.update({ status: 'purchase' });
  res.status(201).json({
    status: 'sucess',
    data: { cartUser, cart, product, actualizacion, producUpdated, order }
  });
});
