import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                category: true,
                account: true,
            },
        });

        if (!transaction) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Transaction not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch transaction',
            },
            { status: 500 }
        );
    }
}

// PUT /api/transactions/[id] - Update a specific transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;
        const body = await request.json();

        const { type, amount, currency, date, description, note, categoryId, accountId } = body;

        // Verify the transaction belongs to the user
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingTransaction) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Transaction not found',
                },
                { status: 404 }
            );
        }

        // Validate transaction type if provided
        if (type && !Object.values(TransactionType).includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid transaction type',
                },
                { status: 400 }
            );
        }

        // Update the transaction
        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: {
                ...(type && { type }),
                ...(amount && { amount: parseFloat(amount) }),
                ...(currency && { currency }),
                ...(date && { date: new Date(date) }),
                ...(description !== undefined && { description }),
                ...(note !== undefined && { note }),
                ...(categoryId !== undefined && { categoryId: categoryId || null }),
                ...(accountId !== undefined && { accountId: accountId || null }),
            },
            include: {
                category: true,
                account: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedTransaction,
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update transaction',
            },
            { status: 500 }
        );
    }
}

// DELETE /api/transactions/[id] - Delete a specific transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getOrCreateUser();
        const { id } = params;

        // Verify the transaction belongs to the user
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingTransaction) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Transaction not found',
                },
                { status: 404 }
            );
        }

        // Delete the transaction
        await prisma.transaction.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete transaction',
            },
            { status: 500 }
        );
    }
}
