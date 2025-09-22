import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getOrCreateUser, getUserCategories } from '@/lib/user';

export async function GET() {
    try {
        // Check if user is authenticated
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Test user creation/retrieval
        const user = await getOrCreateUser();

        // Test default categories creation
        const categories = await getUserCategories(user.id);

        return NextResponse.json({
            success: true,
            message: 'Database integration test successful!',
            data: {
                user: {
                    id: user.id,
                    clerkId: user.clerkId,
                    email: user.email,
                    name: user.name,
                },
                categoriesCount: categories.length,
                categories: categories.map((cat) => ({
                    name: cat.name,
                    budget: cat.budget,
                    color: cat.color,
                    icon: cat.icon,
                })),
            },
        });
    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
