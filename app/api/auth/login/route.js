import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { validateLogin } from '@/lib/validation';

export async function POST(request) {
    try {
        const { login, password } = await request.json();

        // Validate input
        const validation = validateLogin(login, password);
        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: validation.errors.join(', '),
                },
                { status: 400 }
            );
        }

        const { data, status } = await forumsApi.auth.login(login, password);
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
        console.error('Error logging in:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
