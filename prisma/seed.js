const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create restaurants
  const burgerPalace = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      location: 'Downtown',
      description: 'Best burgers in town',
      rating: 4.5,
      image: '🍔'
    }
  });

  const pizzaCorner = await prisma.restaurant.create({
    data: {
      name: 'Pizza Corner',
      location: 'Uptown',
      description: 'Authentic Italian pizzas',
      rating: 4.2,
      image: '🍕'
    }
  });

  const italianKitchen = await prisma.restaurant.create({
    data: {
      name: 'Italian Kitchen',
      location: 'Midtown',
      description: 'Traditional Italian cuisine',
      rating: 4.7,
      image: '🍝'
    }
  });

  const sushiExpress = await prisma.restaurant.create({
    data: {
      name: 'Sushi Express',
      location: 'Westside',
      description: 'Fresh sushi and Asian delights',
      rating: 4.8,
      image: '🍱'
    }
  });

  // Create menu items
  const menuItems = [
    // Burger Palace
    { name: 'Classic Burger', price: 8.99, category: 'Burgers', restaurantId: burgerPalace.id, image: '🍔', description: 'Juicy beef patty with fresh vegetables', isPopular: true },
    { name: 'Cheese Burger', price: 9.99, category: 'Burgers', restaurantId: burgerPalace.id, image: '🍔', description: 'Classic burger with melted cheese' },
    { name: 'French Fries', price: 3.99, category: 'Sides', restaurantId: burgerPalace.id, image: '🍟', description: 'Crispy golden fries' },

    // Pizza Corner
    { name: 'Margherita Pizza', price: 12.99, category: 'Pizza', restaurantId: pizzaCorner.id, image: '🍕', description: 'Fresh mozzarella, tomato sauce, basil', isPopular: true },
    { name: 'Pepperoni Pizza', price: 14.99, category: 'Pizza', restaurantId: pizzaCorner.id, image: '🍕', description: 'Classic pepperoni with cheese' },
    { name: 'Garlic Bread', price: 4.99, category: 'Sides', restaurantId: pizzaCorner.id, image: '🍞', description: 'Toasted bread with garlic butter' },

    // Italian Kitchen
    { name: 'Spaghetti Carbonara', price: 14.99, category: 'Pasta', restaurantId: italianKitchen.id, image: '🍝', description: 'Creamy pasta with pancetta and parmesan', isPopular: true },
    { name: 'Chicken Parmesan', price: 17.99, category: 'Main Course', restaurantId: italianKitchen.id, image: '🍗', description: 'Breaded chicken with marinara and mozzarella' },
    { name: 'Tiramisu', price: 6.99, category: 'Desserts', restaurantId: italianKitchen.id, image: '🍰', description: 'Classic Italian coffee-flavored dessert' },

    // Sushi Express
    { name: 'California Roll', price: 9.99, category: 'Sushi', restaurantId: sushiExpress.id, image: '🍱', description: 'Crab, avocado, cucumber roll' },
    { name: 'Spicy Tuna Roll', price: 11.99, category: 'Sushi', restaurantId: sushiExpress.id, image: '🍱', description: 'Fresh tuna with spicy sauce', isPopular: true },
    { name: 'Miso Soup', price: 3.49, category: 'Appetizers', restaurantId: sushiExpress.id, image: '🍜', description: 'Traditional Japanese soup' },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item
    });
  }

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      type: 'ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@example.com',
      username: 'manager',
      password: hashedPassword,
      type: 'MANAGER'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Member User',
      email: 'member@example.com',
      username: 'member',
      password: hashedPassword,
      type: 'MEMBER'
    }
  });

  await prisma.user.create({
    data: {
      name: 'Customer User',
      email: 'customer@example.com',
      username: 'customer',
      password: hashedPassword,
      type: 'CUSTOMER'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });