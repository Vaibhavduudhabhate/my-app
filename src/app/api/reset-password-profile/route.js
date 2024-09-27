import { NextResponse } from 'next/server';

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        const { user_id, updatedItems } = requestBody;
        const editedValues = {
            updatedItems
        }
        const response = await fetch(`${process.env.api_end_point}/user-password-reset-item/?user_id=${user_id}`, {
            method: "POST",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key,
                // "Authorization":process.env.token,
                Authorization: authHeader,
            },
            body: JSON.stringify({updated_item :updatedItems})
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return NextResponse.json({ message: "User reset password successfully" });
    } catch (error) {
        return NextResponse.json({ message: 'Error while retrieving user reset password' }, { status: 400 });
    }
}