import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidEmail } from '@/lib/validation';

export async function POST(request) {
    try {
        const { email } = await request.json();

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

        const { data, status } = await forumsApi.auth.forgotPassword(email);
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
        console.error('Error sending password reset:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
