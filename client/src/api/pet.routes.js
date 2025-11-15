const express = require('express');
const router = express.Router();
const { Pet } = require('../database');
const { verifyToken } = require('../utils/token');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, type, age } = req.body;
    const validAnimals = ['Dog', 'Cat', 'Bird', 'Hamster'];
    if (!type || !validAnimals.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing pet type' });
    }

    const pet = await Pet.create({ name, type, age, userId: req.userId });
    res.status(201).json({ success: true, message: 'Pet created successfully', data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating pet', data: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const pets = await Pet.findAll({ where: { userId: req.userId } });
    res.status(200).json({ success: true, message: 'Pets retrieved successfully', data: pets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving pets', data: err.message });
  }
});

module.exports = router;
