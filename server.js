const { app } = require('./app');
const { sequelize } = require('./utils/database');
const { Relationships } = require('./utils/initModels');

sequelize
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((error) => console.log(error));

Relationships();

sequelize
  .sync(/*{ force: true }*/)
  .then(() => console.log('Database synchronized'))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server runing in port ${PORT}`);
});
