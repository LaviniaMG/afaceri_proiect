const express = require('express');
const router = express.Router();
const { Order, Product } = require('../database');
const { verifyToken } = require('../utils/token');

// CREATE order cu items
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.userId; // comanda e pentru userul logat

        const order = await Order.create({ userId, total: 0 });
        let total = 0;

        if (items && items.length > 0) {
            for (let item of items) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    await order.addProduct(product, { through: { quantity: item.quantity, price: product.price } });
                    total += product.price * item.quantity;
                }
            }
        }

        await order.update({ total });
        const fullOrder = await Order.findByPk(order.id, { include: Product });
        res.status(201).json({ success: true, message: 'Order created successfully', data: fullOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating order', data: err.message });
    }
});

// READ all orders
router.get('/', verifyToken, async (req, res) => {
  try {
    let orders;
    if (req.userRole === 'admin') {
      orders = await Order.findAll({ 
        include: [
          { model: Product, through: { attributes: ['quantity', 'price'] } },
        ] 
      });
    } else {
      orders = await Order.findAll({ 
        where: { userId: req.userId }, 
        include: [
          { model: Product, through: { attributes: ['quantity', 'price'] } },
        ] 
      });
    }
    res.status(200).json({ success: true, message: 'Orders retrieved successfully', data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving orders', data: err.message });
  }
});

// READ order by id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { 
      include: [
        { model: Product, through: { attributes: ['quantity', 'price'] } },
      ] 
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

// UPDATE order status - doar admin
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admin can update order status' });
        }

        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const { status } = req.body;
        await order.update({ status });
        res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating order', data: err.message });
    }
});

// DELETE order - admin sau proprietar
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.userId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this order' });
        }

        await order.destroy();
        res.status(200).json({ success: true, message: 'Order deleted successfully', data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting order', data: err.message });
    }
});

module.exports = router;
