import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/propertyReport-create-item`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                body: JSON.stringify(requestBody),
            }
        );

        return NextResponse.json({
            message: "property report created successfully",
        });
    } catch (error) {
        console.error("Error while creating property report:", error);
        return NextResponse.json(
            { message: "Error while createing property" },
            { status: 500 }
        );
    }
}
