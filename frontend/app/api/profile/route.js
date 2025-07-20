import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        
        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            );
        }

        // Get authorization header from the request
        const authHeader = request.headers.get('Authorization');
        const headers = {};
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(`http://login-reg:8082/api/v1/auth/profile?email=${encodeURIComponent(email)}`, {
            headers
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        
        // Get authorization header from the request
        const authHeader = request.headers.get('Authorization');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        
        const response = await fetch('http://login-reg:8082/api/v1/auth/profile', {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
