import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['signature-bowl', 'signature-pita', 'custom-bowl', 'custom-pita', 'drink'] },
  price: { type: Number, required: true },
  description: String,
  image: String,
  
  // For signature items
  defaultToppings: [String],
  
  // For custom items (available options)
  availableOptions: {
    bases: [String],
    proteins: [String],
    spreads: [String],
    toppings: [String],
    dressings: [String],
  },
  
  // For drinks
  sizes: [{
    name: String, // 'small' or 'large'
    price: Number
  }],
  
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
