import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    console.log('Received order data:', JSON.stringify(req.body, null, 2));
    const orderData = {
      ...req.body,
      totalItems: req.body.items?.length || 0,
    };
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json({ 
      message: 'Order created successfully',
      order: savedOrder 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error: error.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

export default router;
