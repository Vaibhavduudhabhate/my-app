import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/get-all-user-item`,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                cache: "no-cache", // Include cache option here
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Error while retrieving user properties" },
            { status: 500 }
        );
    }
}
