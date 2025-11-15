const express = require('express');
const router = express.Router();
const { Pet } = require('../database');
const { verifyToken } = require('../utils/token');

// CREATE user isi adauga propriul animal
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
        const userId = req.userId; 
        const pets = await Pet.findAll({ where: { userId } });
        res.status(200).json({ success: true, message: 'Pets retrieved successfully', data: pets });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving pets', data: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

        if (pet.userId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this pet' });
        }

        await pet.destroy();
        res.status(200).json({ success: true, message: 'Pet deleted successfully', data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting pet', data: err.message });
    }
});

// READ by id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
        res.status(200).json({ success: true, message: 'Pet retrieved successfully', data: pet });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving pet', data: err.message });
    }
});

// UPDATE - doar proprietarul sau admin
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

        if (pet.userId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this pet' });
        }

        const { name, type, age } = req.body;
        const validAnimals = ['Dog', 'Cat', 'Bird', 'Hamster'];
        if (type && !validAnimals.includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid pet type' });
        }

        const updatedPet = await pet.update({ 
            name: name ?? pet.name, 
            type: type ?? pet.type, 
            age: age ?? pet.age 
        });

        res.status(200).json({ success: true, message: 'Pet updated successfully', data: updatedPet });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating pet', data: err.message });
    }
});


module.exports = router;
