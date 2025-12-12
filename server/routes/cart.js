import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// GET /api/cart/:sessionId - Get cart for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

// PUT /api/cart/:sessionId - Update/create cart (upsert)
router.put('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { items } = req.body;
    
    // Upsert: update if exists, create if doesn't
    const cart = await Cart.findOneAndUpdate(
      { sessionId },
      { items, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json({ message: 'Cart saved successfully', cart });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Failed to save cart', error: error.message });
  }
});

// DELETE /api/cart/:sessionId - Clear cart
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await Cart.findOneAndUpdate(
      { sessionId },
      { items: [], lastUpdated: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
});

export default router;
