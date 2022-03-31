const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { promisify } = require('util');

const { Users } = require('../models/users');

const { AppError } = require('../utils/appErrors');
const { catchAsync } = require('../utils/catchAsync');

dotenv.config({ path: './config.env' });

exports.validateSesion = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(401, 'Invalid sesion'));
  }

  const codificatedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await Users.findOne({
    where: { id: codificatedToken.id, status: 'active' },
    attributes: {
      exclude: ['password']
    }
  });

  if (!user) {
    return next(new AppError(401, 'Invalid sesion'));
  }

  req.currentUser = user;

  next();
});
