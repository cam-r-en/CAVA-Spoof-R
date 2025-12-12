import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  quantity: Number,
  toppings: [String],
  removedToppings: [String],
  base: [String],
  protein: [String],
  spreads: [String],
  dressings: [String],
  size: String
}, { _id: false });

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [cartItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update lastUpdated on save
cartSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
