import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';
import { prisma } from '@/lib/prisma';

// GET /api/categories/[id] - Get a specific category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch category',
            },
            { status: 500 }
        );
    }
}

// PUT /api/categories/[id] - Update a specific category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;
        const body = await request.json();

        const { name, description, color, icon, budget } = body;

        // Verify the category belongs to the user
        const existingCategory = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category not found',
                },
                { status: 404 }
            );
        }

        // Check if new name conflicts with existing categories (if name is being changed)
        if (name && name !== existingCategory.name) {
            const nameConflict = await prisma.category.findFirst({
                where: {
                    name,
                    userId: user.id,
                    id: { not: id },
                },
            });

            if (nameConflict) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Category with this name already exists',
                    },
                    { status: 400 }
                );
            }
        }

        // Update the category
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(color && { color }),
                ...(icon && { icon }),
                ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedCategory,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update category',
            },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/[id] - Delete a specific category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;

        // Verify the category belongs to the user
        const existingCategory = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category not found',
                },
                { status: 404 }
            );
        }

        // Check if category has transactions
        const transactionCount = await prisma.transaction.count({
            where: {
                categoryId: id,
                userId: user.id,
            },
        });

        if (transactionCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot delete category. It has ${transactionCount} associated transactions. Please reassign or delete those transactions first.`,
                },
                { status: 400 }
            );
        }

        // Delete the category
        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete category',
            },
            { status: 500 }
        );
    }
}
