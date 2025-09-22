import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, getUserCategories } from '@/lib/user';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories for the current user
export async function GET() {
    try {
        const user = await getOrCreateUser();
        const categories = await getUserCategories(user.id);

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch categories',
            },
            { status: 500 }
        );
    }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
    try {
        const user = await getOrCreateUser();
        const body = await request.json();

        const { name, description, color, icon, budget } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category name is required',
                },
                { status: 400 }
            );
        }

        // Check if category name already exists for this user
        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                userId: user.id,
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category with this name already exists',
                },
                { status: 400 }
            );
        }

        // Create the category
        const category = await prisma.category.create({
            data: {
                name,
                description,
                color,
                icon,
                budget: budget ? parseFloat(budget) : null,
                userId: user.id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: category,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create category',
            },
            { status: 500 }
        );
    }
}
