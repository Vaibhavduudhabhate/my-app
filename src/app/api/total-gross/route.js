import { NextResponse } from 'next/server';

export async function POST(request) {
    // console.log("request",request)
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        const { selectedPropertyId } = requestBody;
        console.log("selectedPropertyId",selectedPropertyId)
        const response = await fetch(`${process.env.api_end_point}/propertyReport-collection-total-item?property_id=${selectedPropertyId}`, {
            method: "GET",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key,
                Authorization: authHeader,
            },
        });

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        console.log("response",response)
        const data = await response.json();
        console.log("total gross data...", data);

        return NextResponse.json({ message: "total gross retrieved successfully", data });
    } catch (error) {
        console.error('Error while retrieving total gross:', error);
        return NextResponse.json({ message: 'Error while retrieving total gross' }, { status: 500 });
    }
}
