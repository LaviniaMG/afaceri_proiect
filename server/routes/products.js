const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Product, Pet } = require('../database');
const { verifyToken } = require('../utils/token');

// Config multer pentru upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // folderul unde se salvează imaginile
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // denumire unică
    }
});

const upload = multer({ storage });
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Only admin allowed" });
    }
    next();
};
// CREATE product - admin only
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admin can create products' });
        }

        const { name, description, price, stock, targetAnimal } = req.body;
        const validAnimals = ['Dog', 'Cat', 'Bird', 'Hamster'];
        if (!targetAnimal || !validAnimals.includes(targetAnimal)) {
            return res.status(400).json({ error: 'Invalid or missing targetAnimal type' });
        }

        const image = req.file ? req.file.filename : null;

        const product = await Product.create({ name, description, price, stock, targetAnimal, image });
        res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating product', data: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        let products;
        if (userId) {
            const pets = await Pet.findAll({ where: { userId } });
            const petTypes = pets.map(p => p.type);
            products = await Product.findAll({ where: { targetAnimal: petTypes } });
        } else {
            products = await Product.findAll();
        }

        res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving products', data: err.message });
    }
});

const { Op } = require('sequelize');

router.get('/for-user', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const pets = await Pet.findAll({ where: { userId } });
        const petTypes = pets.map(p => p.type);

        if (petTypes.length === 0) {
            return res.status(200).json({ success: true, message: 'No products for user', data: [] });
        }

        const products = await Product.findAll({
            where: {
                targetAnimal: { [Op.in]: petTypes }
            }
        });

        res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving products', data: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Product id is not valid', data: {} });

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });

        res.status(200).json({ success: true, message: 'Product retrieved successfully', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving product', data: err.message });
    }
});

// UPDATE product - admin only
router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        console.log(req);
        //   console.log();
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admin can update products' });
        }

        const id = req.params.id;
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Product id is not valid', data: {} });

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });

        const { name, description, price, stock, targetAnimal } = req.body;
        const validAnimals = ['Dog', 'Cat', 'Bird', 'Hamster'];
        if (targetAnimal && !validAnimals.includes(targetAnimal)) {
            return res.status(400).json({ error: 'Invalid targetAnimal type' });
        }

        const updatedFields = {
            name: name ?? product.name,
            description: description ?? product.description,
            price: price ?? product.price,
            stock: stock ?? product.stock,
            targetAnimal: targetAnimal ?? product.targetAnimal,
        };

        if (req.file) updatedFields.image = req.file.filename;

        const updatedProduct = await product.update(updatedFields);
        res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating product', data: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admin can delete products' });
        }

        const id = req.params.id;
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'Product id is not valid', data: {} });

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });

        await product.destroy();
        res.status(200).json({ success: true, message: 'Product successfully deleted', data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting product', data: err.message });
    }
});

module.exports = router;
