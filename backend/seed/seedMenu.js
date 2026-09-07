// Seeds the database with a demo menu for Kamil Cafe.
// Run once with: npm run seed:menu
// This is placeholder demo content - replace with the real menu from the
// admin dashboard once this is used for an actual client.
require("dotenv").config();
const connectDB = require("../config/db");
const MenuItem = require("../models/MenuItem");

const items = [
  // ---------------- COFFEE ----------------
  { name: "Espresso", category: "Coffee", price: 120, dietTag: "veg" },
  { name: "Americano", category: "Coffee", price: 140, dietTag: "veg" },
  { name: "Cappuccino", category: "Coffee", price: 160, dietTag: "veg" },
  { name: "Cafe Latte", category: "Coffee", price: 170, dietTag: "veg" },
  { name: "Flat White", category: "Coffee", price: 180, dietTag: "veg" },
  { name: "Mocha", category: "Coffee", price: 190, dietTag: "veg" },
  { name: "Affogato", category: "Coffee", price: 210, dietTag: "veg" },

  // ---------------- COLD BREW & ICED ----------------
  { name: "Cold Brew", category: "Cold Brew & Iced", price: 190, dietTag: "veg" },
  { name: "Iced Latte", category: "Cold Brew & Iced", price: 200, dietTag: "veg" },
  { name: "Iced Mocha", category: "Cold Brew & Iced", price: 210, dietTag: "veg" },
  { name: "Vietnamese Iced Coffee", category: "Cold Brew & Iced", price: 220, dietTag: "veg" },
  { name: "Nitro Cold Brew", category: "Cold Brew & Iced", price: 240, dietTag: "veg" },

  // ---------------- TEA ----------------
  { name: "Masala Chai", category: "Tea", price: 100, dietTag: "veg" },
  { name: "Earl Grey", category: "Tea", price: 130, dietTag: "veg" },
  { name: "Green Tea", category: "Tea", price: 120, dietTag: "veg" },
  { name: "Matcha Latte", category: "Tea", price: 210, dietTag: "veg" },
  { name: "Chamomile Tea", category: "Tea", price: 130, dietTag: "veg" },

  // ---------------- PASTRIES & BAKES ----------------
  { name: "Butter Croissant", category: "Pastries & Bakes", price: 150, dietTag: "veg" },
  { name: "Almond Croissant", category: "Pastries & Bakes", price: 180, dietTag: "veg" },
  { name: "Pain au Chocolat", category: "Pastries & Bakes", price: 170, dietTag: "veg" },
  { name: "Cinnamon Roll", category: "Pastries & Bakes", price: 160, dietTag: "veg" },
  { name: "Blueberry Muffin", category: "Pastries & Bakes", price: 140, dietTag: "veg" },
  { name: "Banana Walnut Loaf", category: "Pastries & Bakes", price: 150, dietTag: "veg" },

  // ---------------- BREAKFAST ----------------
  { name: "Avocado Toast", category: "Breakfast", price: 260, dietTag: "veg" },
  { name: "Eggs Benedict", category: "Breakfast", price: 280, dietTag: "veg" },
  { name: "Classic Pancakes", category: "Breakfast", price: 220, dietTag: "veg" },
  { name: "Granola & Yogurt Bowl", category: "Breakfast", price: 200, dietTag: "veg" },
  { name: "Shakshuka", category: "Breakfast", price: 270, dietTag: "veg" },

  // ---------------- SANDWICHES ----------------
  { name: "Grilled Cheese Sandwich", category: "Sandwiches", price: 210, dietTag: "veg" },
  { name: "Caprese Panini", category: "Sandwiches", price: 240, dietTag: "veg" },
  { name: "Club Sandwich", category: "Sandwiches", price: 260, dietTag: "veg" },
  { name: "Mushroom Melt", category: "Sandwiches", price: 230, dietTag: "veg" },

  // ---------------- DESSERTS ----------------
  { name: "Chocolate Lava Cake", category: "Desserts", price: 220, dietTag: "veg" },
  { name: "New York Cheesecake", category: "Desserts", price: 240, dietTag: "veg" },
  { name: "Tiramisu", category: "Desserts", price: 250, dietTag: "veg" },
  { name: "Baklava", category: "Desserts", price: 180, dietTag: "veg" },
];

const seedMenu = async () => {
  try {
    await connectDB();
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(items);
    console.log(`Seeded ${items.length} menu items successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("Menu seed failed:", err.message);
    process.exit(1);
  }
};

seedMenu();
