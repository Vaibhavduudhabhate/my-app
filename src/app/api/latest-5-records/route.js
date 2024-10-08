import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/propertyReport-list-item`,
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
            { message: "Error while retrieving latest records" },
            { status: 500 }
        );
    }
}
