import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

// GET /api/restaurants - Get all restaurants
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        menuItems: {
          where: { isAvailable: true }
        }
      }
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// POST /api/restaurants - Create a new restaurant
export async function POST(request) {
  try {
    const { name, location, description, rating, image } = await request.json();

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        description,
        rating: rating || 0,
        image
      }
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}