import { NextResponse } from 'next/server';

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        console.log("request", requestBody);
        const { report_id, updated_item } = requestBody;
        console.log("username",report_id);
        console.log("updatedData",updated_item);
        const editedValues = {
            // username: username,
            updated_item
        }
        console.log(editedValues);
        const response = await fetch(`${process.env.api_end_point}/propertyReport-update-item/?report_id=${report_id}`, {
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
        console.log("user data...", data);

        return NextResponse.json({ message: "Daily report updated successfully" });
    } catch (error) {
        console.error('Error while retrieving user properties:', error);
        return NextResponse.json({ message: 'Error while retrieving daily report' }, { status: 500 });
    }
}