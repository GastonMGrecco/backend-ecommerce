const express = require('express');
const { cartsRoutes } = require('./routes/carts');
const { productsRoutes } = require('./routes/products');
const { usersRoutes } = require('./routes/users');
const { globalErrorHandler } = require('./controllers/globalErrorHandler');
const app = express();

app.use(express.json());

app.use('/api/v1/carts', cartsRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/users', usersRoutes);

app.use(globalErrorHandler);
module.exports = { app };
