import { NextResponse } from 'next/server';
import { forumsApi, ApiError } from '@/lib/forumsApi';
import { isValidSearchQuery, isValidSearchType, isValidPage } from '@/lib/validation';

export async function POST(request) {
    try {
        const { query, type, page = 1 } = await request.json();

        // Validate input
        if (!isValidSearchQuery(query)) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Search query must be between 1 and 100 characters',
                },
                { status: 400 }
            );
        }

        if (!isValidSearchType(type)) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Search type must be one of: threads, posts, all',
                },
                { status: 400 }
            );
        }

        if (!isValidPage(page)) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    message: 'Invalid page number',
                },
                { status: 400 }
            );
        }

        const { data, status } = await forumsApi.search.query(query, type.toLowerCase(), page);
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
        console.error('Error searching:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
