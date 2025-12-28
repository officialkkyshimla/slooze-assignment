const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // =====================
  // Restaurants (SAFE)
  // =====================
  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        name: 'Burger Palace',
        location: 'Downtown',
        description: 'Best burgers in town',
        rating: 4.5,
        image: '🍔'
      },
      {
        name: 'Pizza Corner',
        location: 'Uptown',
        description: 'Authentic Italian pizzas',
        rating: 4.2,
        image: '🍕'
      },
      {
        name: 'Italian Kitchen',
        location: 'Midtown',
        description: 'Traditional Italian cuisine',
        rating: 4.7,
        image: '🍝'
      },
      {
        name: 'Sushi Express',
        location: 'Westside',
        description: 'Fresh sushi and Asian delights',
        rating: 4.8,
        image: '🍱'
      }
    ],
    skipDuplicates: true
  });

  const allRestaurants = await prisma.restaurant.findMany();

  const byName = (name) =>
    allRestaurants.find(r => r.name === name).id;

  // =====================
  // Menu Items
  // =====================
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Classic Burger',
        price: 8.99,
        category: 'Burgers',
        restaurantId: byName('Burger Palace'),
        image: '🍔',
        description: 'Juicy beef patty with fresh vegetables',
        isPopular: true
      },
      {
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'Pizza',
        restaurantId: byName('Pizza Corner'),
        image: '🍕',
        description: 'Fresh mozzarella, tomato sauce, basil',
        isPopular: true
      }
    ],
    skipDuplicates: true
  });

  // =====================
  // Users (FIXED)
  // =====================
  const password = await bcrypt.hash('password123', 12);

  const users = [
    { name: 'Admin User', email: 'admin@example.com', username: 'admin', type: 'ADMIN' },
    { name: 'Manager User', email: 'manager@example.com', username: 'manager', type: 'MANAGER' },
    { name: 'Member User', email: 'member@example.com', username: 'member', type: 'MEMBER' },
    { name: 'Customer User', email: 'customer@example.com', username: 'customer', type: 'CUSTOMER' }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email }, // ✅ UNIQUE
      update: {},
      create: {
        ...user,
        password
      }
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
