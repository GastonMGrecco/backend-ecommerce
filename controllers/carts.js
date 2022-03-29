const { Carts } = require('../models/carts');
const { Orders } = require('../models/orders');
const { Products } = require('../models/products');
const { ProductsInCart } = require('../models/productsIncart');
const { Users } = require('../models/users');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appErrors');

exports.createAddProductInCart = catchAsync(async (req, res, next) => {
  const { productId, quantity, userId } = req.body;
  if (!productId || !quantity || !userId) {
    return next(
      new AppError(400, 'Must provide an cartId,productId and quantity')
    );
  }
  /*
  const carro= await Carts.findOne({where:{status:'active'}})
  if(!carro){
    const cartWhiteUserId = await Carts.create({
        id:,
        userId
      });
    if(carro.id===userId){
        const cartWhiteProducts = await ProductsInCart.create({
            cartId:carroId
            productId,
            quantity
          });
          res.status(201).json({
            status: { cartWhiteProducts, cartWhiteUserId }
          });
    }
*/
});

exports.updateProductCart = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
});

exports.deleteProductCart = catchAsync(async (req, res, next) => {});

exports.purchaseProuctCart = catchAsync(async (req, res, next) => {});
