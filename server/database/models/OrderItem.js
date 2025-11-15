const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('OrderItem', {
   quantity: { 
  type: DataTypes.INTEGER, 
  defaultValue: 1, 
  validate: { min: 1 } 
},
price: { 
  type: DataTypes.FLOAT, 
  allowNull: false, 
  validate: { min: 0 } 
},
OrderId: { type: DataTypes.INTEGER, allowNull: false },
    ProductId: { type: DataTypes.INTEGER, allowNull: false }
  });
};
