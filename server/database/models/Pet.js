const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
  });
};
