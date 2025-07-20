import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://login-reg:8082/api/research-interests');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching research interests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch research interests' },
            { status: 500 }
        );
    }
}
