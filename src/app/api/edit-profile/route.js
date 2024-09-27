import { NextResponse } from 'next/server';

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        console.log("request", requestBody);
        const { user_id, updated_item } = requestBody;
        console.log("username",user_id);
        console.log("updatedData",updated_item);
        const editedValues = {
            // username: username,
            updated_item
        }
        console.log(editedValues);
        const response = await fetch(`${process.env.api_end_point}/user-update-item/?user_id=${user_id}`, {
            method: "POST",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key,
                // "Authorization":process.env.token,
                Authorization: authHeader,
            },
            body: JSON.stringify({updated_item})
        });

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }

        const data = await response.json();
        console.log("profile data...", data);

        return NextResponse.json({ message: "User Profile updated successfully" });
    } catch (error) {
        console.error('Error while retrieving user Profile:', error);
        return NextResponse.json({ message: 'Error while retrieving user profile' }, { status: 500 });
    }
}