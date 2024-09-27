import { NextResponse } from "next/server";

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        const response = await fetch(
            `${process.env.api_end_point}/user-create-item`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                body: JSON.stringify(requestBody),
            }
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return NextResponse.json({ message: "User created successfully", data: response });
    } catch (error) {
        console.error("Error while creating user:", );
        return NextResponse.json(
            { message: "User id Already Exist" },
            { status: 403 }
        );
    }
}
