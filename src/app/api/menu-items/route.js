import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

// GET /api/menu-items - Get all menu items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const restaurantId = searchParams.get('restaurantId');

    const where = {
      isAvailable: true
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        restaurant: true
      },
      orderBy: {
        isPopular: 'desc'
      }
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu-items - Create a new menu item
export async function POST(request) {
  try {
    const { name, description, price, category, image, restaurantId, isPopular } = await request.json();

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        restaurantId,
        isPopular: isPopular || false
      },
      include: {
        restaurant: true
      }
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}