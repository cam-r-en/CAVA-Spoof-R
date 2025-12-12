import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cava-restaurant';

const menuData = [
  // Signature Bowls
  {
    name: 'Greek Chicken Bowl',
    category: 'signature-bowl',
    price: 12.99,
    description: 'Grilled chicken with fresh Mediterranean toppings',
    defaultToppings: ['Tomato + Onion', 'Pickled Onions', 'Avocado'],
  },
  {
    name: 'Harissa Avocado Bowl',
    category: 'signature-bowl',
    price: 11.99,
    description: 'Spicy harissa with creamy avocado',
    defaultToppings: ['Greens', 'Feta', 'Pickled Onions'],
  },
  {
    name: 'Spicy Lamb + Avocado Bowl',
    category: 'signature-bowl',
    price: 14.99,
    description: 'Braised lamb with spicy kick',
    defaultToppings: ['Tomato + Onion', 'Pickled Onions', 'Avocado'],
  },
  
  // Signature Pitas
  {
    name: 'Greek Chicken Pita',
    category: 'signature-pita',
    price: 10.99,
    description: 'Classic Greek chicken wrapped in warm pita',
    defaultToppings: ['Tomato + Onion', 'Pickled Onions', 'Avocado'],
  },
  {
    name: 'Steak & Feta Pita',
    category: 'signature-pita',
    price: 12.99,
    description: 'Tender steak with tangy feta',
    defaultToppings: ['Briny Pickles', 'Pickled Onions'],
  },
  
  // Custom Options
  {
    name: 'Custom Bowl',
    category: 'custom-bowl',
    price: 10.99,
    description: 'Build your own bowl',
    availableOptions: {
      bases: ['SuperGreens', 'Romaine', 'Basmati Rice'],
      proteins: ['Grilled Chicken', 'Falafel', 'Braised Lamb'],
      spreads: ['Hummus', 'Tzatziki', 'Red Pepper Hummus', 'Crazy Feta'],
      toppings: ['Tomato + Onion Salad', 'Pickled Onions', 'Avocado', 'Kalamata Olives'],
      dressings: ['Greek Vinaigrette', 'Lemon Herb Tahini', 'Hot Harissa Vinaigrette'],
    },
  },
  {
    name: 'Custom Pita',
    category: 'custom-pita',
    price: 9.99,
    description: 'Build your own pita',
    availableOptions: {
      proteins: ['Grilled Chicken', 'Falafel', 'Braised Lamb'],
      spreads: ['Hummus', 'Tzatziki', 'Red Pepper Hummus', 'Crazy Feta'],
      toppings: ['Tomato + Onion Salad', 'Pickled Onions', 'Avocado', 'Kalamata Olives'],
      dressings: ['Greek Vinaigrette', 'Lemon Herb Tahini', 'Hot Harissa Vinaigrette'],
    },
  },
  
  // Drinks
  {
    name: 'Pineapple Apple Mint',
    category: 'drink',
    price: 3.99,
    description: 'Refreshing fruit blend',
    sizes: [
      { name: 'small', price: 2.99 },
      { name: 'large', price: 3.99 }
    ],
  },
  {
    name: 'Blueberry Lavender',
    category: 'drink',
    price: 3.99,
    description: 'Sweet and floral',
    sizes: [
      { name: 'small', price: 2.99 },
      { name: 'large', price: 3.99 }
    ],
  },
  {
    name: 'Cucumber Mint Lime',
    category: 'drink',
    price: 3.99,
    description: 'Cool and refreshing',
    sizes: [
      { name: 'small', price: 2.99 },
      { name: 'large', price: 3.99 }
    ],
  },
  {
    name: 'Classic Lemonade',
    category: 'drink',
    price: 2.99,
    description: 'Traditional fresh lemonade',
    sizes: [
      { name: 'small', price: 2.49 },
      { name: 'large', price: 2.99 }
    ],
  },
  {
    name: 'Jasmine Green Tea',
    category: 'drink',
    price: 2.99,
    description: 'Light and aromatic',
    sizes: [
      { name: 'small', price: 2.49 },
      { name: 'large', price: 2.99 }
    ],
  },
  {
    name: 'Unsweet Tea',
    category: 'drink',
    price: 2.49,
    description: 'Classic iced tea',
    sizes: [
      { name: 'small', price: 1.99 },
      { name: 'large', price: 2.49 }
    ],
  },
  {
    name: 'Fountain Soda',
    category: 'drink',
    price: 2.49,
    description: 'Variety of sodas',
    sizes: [
      { name: 'small', price: 1.99 },
      { name: 'large', price: 2.49 }
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert new menu items
    const items = await MenuItem.insertMany(menuData);
    console.log(`✅ Successfully seeded ${items.length} menu items`);

    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
