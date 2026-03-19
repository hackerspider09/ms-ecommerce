const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: "Smartphone X",
    description: "Latest generation smartphone with OLED display.",
    price: 999,
    category: "Electronics",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
  },
  {
    name: "Wireless Headphones",
    description: "Noise-canceling over-ear headphones.",
    price: 199,
    category: "Accessories",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
  },
  {
    name: "Laptop Pro",
    description: "High-performance laptop for professionals.",
    price: 1499,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();
