import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateThread } from '@/lib/validation';

export async function POST(request) {
    try {
        const { title, body, userId } = await request.json();

        // Validate user ID (UUID string)
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Valid User ID is required',
                },
                { status: 400 }
            );
        }

        // Validate thread data
        const validation = validateThread(title, body);
        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: validation.errors.join(', '),
                },
                { status: 400 }
            );
        }

        const { data, status } = await forumsApi.threads.create(
            validation.sanitized.title, 
            validation.sanitized.body, 
            userId
        );
        return NextResponse.json(data, { status });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { 
                    error: error.message,
                    ...error.data 
                },
                { status: error.status }
            );
        }
        console.error('Error creating thread:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
