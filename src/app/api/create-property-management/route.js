import { NextResponse } from "next/server";

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    console.log(authHeader);

    try {
        const requestBody = await request.json();
        console.log("requestBody",requestBody)
        const response = await fetch(
            `${process.env.api_end_point}/property-create-item`,
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

        return NextResponse.json({
            message: "User property created successfully",
        });
    } catch (error) {
        console.error("Error while creating property:", error);
        return NextResponse.json(
            { message: "Error while createing property" },
            { status: 500 }
        );
    }
}
