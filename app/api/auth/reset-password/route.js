import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidEmail, isValidPassword } from '@/lib/validation';

export async function POST(request) {
    try {
        const { email, password, token } = await request.json();

        // Validate input
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Invalid email address',
                },
                { status: 400 }
            );
        }

        if (!isValidPassword(password)) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Password must be at least 8 characters long',
                },
                { status: 400 }
            );
        }

        if (!token || typeof token !== 'string') {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Reset token is required',
                },
                { status: 400 }
            );
        }

        const { data, status } = await forumsApi.auth.resetPassword(email, password, token);
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
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
