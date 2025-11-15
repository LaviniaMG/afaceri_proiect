const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name cannot be empty'
        },
        len: {
          args: [3, 255],
          msg: 'Product name must be between 3 and 255 characters'
        }
      }
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Price cannot be negative'
        },
        isNumeric: {
          msg: 'Price must be a number'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock cannot be negative'
        },
        isInt: {
          msg: 'Stock must be an integer'
        }
      }
    },
    targetAnimal: { type: DataTypes.STRING, allowNull: false } // ex: "Dog", "Cat", "Bird", "Hamster",
    , image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
