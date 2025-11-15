const express = require('express');
const router = express.Router();
const { Order, Product, User, Pet } = require('../database');
const { verifyToken } = require('../utils/token');
const { Op } = require('sequelize');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.userId;
        //comanda goala
        const order = await Order.create({ userId, total: 0 });
        let total = 0;
        if (items && items.length > 0) {
            for (let item of items) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    //pt a stabilii produsele in tab intermediara
                    await order.addProduct(product, {
                        through: { quantity: item.quantity, price: product.price },
                    });
                    total += product.price * item.quantity;
                }
            }
        }
        await order.update({ total });
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity', 'price'] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                    include: [
                        {
                            model: Pet,
                            attributes: ['id', 'name', 'type', 'age'],
                        },
                    ],
                },
            ],
        });
        res.status(201).json({success: true, message: 'Order created successfully',data: fullOrder,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating order', data: err.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        let orders;

        const includeOptions = [
            {
                model: Product,
                through: { attributes: ['quantity', 'price'] },
            },
            {
                model: User,
                attributes: ['id', 'name', 'email'],
                include: [{ model: Pet, attributes: ['id', 'name', 'type', 'age'] }],
            },
        ];

        if (req.userRole === 'admin') {
            orders = await Order.findAll({ include: includeOptions });
        } else {
            orders = await Order.findAll({
                where: { userId: req.userId },
                include: includeOptions,
            });
        }

        res.status(200).json({ success: true, message: 'Orders retrieved successfully', data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving orders', data: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity', 'price'] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'],
                    include: [{ model: Pet, attributes: ['id', 'name', 'type', 'age'] }],
                },
            ],
        });

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, message: 'Order retrieved successfully', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving order', data: err.message });
    }
});

module.exports = router;
