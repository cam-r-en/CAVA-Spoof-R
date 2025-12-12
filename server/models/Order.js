import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  quantity: { type: Number, default: 1 },
  toppings: [String],
  removedToppings: [String],
  base: [String],
  protein: [String],
  spreads: [String],
  dressings: [String],
  size: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // Customer information (optional - can add later)
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  
  // Order details
  items: [itemSchema],
  
  // Order metadata
  totalItems: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending' 
  },
  notes: String,
  
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
