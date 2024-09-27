import { NextResponse } from 'next/server';

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        const { user_id } = requestBody;
        console.log(user_id)
        const response = await fetch(`${process.env.api_end_point}/user-read-item?user_id=${user_id}`, {
            method: "GET",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key,
                Authorization: authHeader,
            },
        });

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }

        const data = await response.json();
        console.log("user profile data...", data);

        return NextResponse.json({ message: "User Profile retrieved successfully", data });
    } catch (error) {
        console.error('Error while retrieving user profile:', error);
        return NextResponse.json({ message: 'Error while retrieving user profile' }, { status: 500 });
    }
}
