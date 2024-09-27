import { NextResponse } from 'next/server';


export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const response = await fetch(`${process.env.api_end_point}/get-all-property-item`, {
            method: "GET",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key,
                Authorization: authHeader,
            },
        });

        const data = await response.json();
        // console.log("user management property list...", data);

        return NextResponse.json({ message: "Get all properties retrieved successfully", data });
    } catch (error) {
        console.error('Error while get all properties:', error);
        return NextResponse.json({ message: 'Error while retrieving get all properties' }, { status: 500 });
    }
}
