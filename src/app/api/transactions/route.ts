import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';
import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// GET /api/transactions - Get all transactions for the current user
export async function GET(request: NextRequest) {
    try {
        const user = await getOrCreateUser();
        const { searchParams } = new URL(request.url);

        // Optional query parameters for filtering
        const categoryId = searchParams.get('categoryId');
        const type = searchParams.get('type') as TransactionType | null;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build where clause
        const where: any = {
            userId: user.id,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (type) {
            where.type = type;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                where.date.lte = new Date(endDate);
            }
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                category: true,
                account: true,
            },
            orderBy: {
                date: 'desc',
            },
            take: limit,
            skip: offset,
        });

        const total = await prisma.transaction.count({ where });

        return NextResponse.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch transactions',
            },
            { status: 500 }
        );
    }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
    try {
        const user = await getOrCreateUser();
        const body = await request.json();

        const { type, amount, currency, date, description, note, categoryId, accountId } = body;

        // Validate required fields
        if (!type || !amount || !date) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: type, amount, date',
                },
                { status: 400 }
            );
        }

        // Validate transaction type
        if (!Object.values(TransactionType).includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid transaction type',
                },
                { status: 400 }
            );
        }

        // Create the transaction
        const transaction = await prisma.transaction.create({
            data: {
                type,
                amount: parseFloat(amount),
                currency: currency || 'USD',
                date: new Date(date),
                description,
                note,
                categoryId: categoryId || null,
                accountId: accountId || null,
                userId: user.id,
            },
            include: {
                category: true,
                account: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: transaction,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create transaction',
            },
            { status: 500 }
        );
    }
}
