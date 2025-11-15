const express = require('express');
const router = express.Router();
const { Product, Pet } = require('../database');
const { verifyToken } = require('../utils/token');
const { Op } = require('sequelize');

router.get('/', verifyToken, async (req, res) => {
  try {
    const pets = await Pet.findAll({ where: { userId: req.userId } });
    const petTypes = pets.map(p => p.type);

    const products = await Product.findAll({
      where: {
        targetAnimal: petTypes.length ? { [Op.in]: petTypes } : { [Op.in]: ['Dog', 'Cat', 'Bird', 'Hamster'] }
      }
    });

    res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving products', data: err.message });
  }
});

module.exports = router;
