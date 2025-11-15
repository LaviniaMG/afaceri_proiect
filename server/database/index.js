const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging:false //sa nu ne spameze in consola
});

const User = require('./models/user')(sequelize);
const Pet = require('./models/pet')(sequelize);
const Product = require('./models/product')(sequelize);
const Order = require('./models/Order')(sequelize);
const OrderItem = require('./models/OrderItem')(sequelize);


User.hasMany(Pet, { foreignKey: 'userId' });
Pet.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

module.exports = {
  sequelize,
  User,
  Pet,
  Product,
  Order,
  OrderItem
};
