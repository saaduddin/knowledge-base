import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateRegistration } from '@/lib/validation';

export async function POST(request) {
    try {
        const { username, email, password } = await request.json();

        // Validate input
        const validation = validateRegistration(username, email, password);
        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: validation.errors.join(', '),
                },
                { status: 400 }
            );
        }

        const { data, status } = await forumsApi.auth.register(username, email, password);
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
        console.error('Error registering:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
