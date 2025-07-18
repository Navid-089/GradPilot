import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://localhost:8182/api/majors');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching majors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch majors' },
            { status: 500 }
        );
    }
}
