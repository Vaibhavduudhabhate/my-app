import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { property_id, updated_item } = requestBody;
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/property-update-item?property_id=${property_id}`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                body: JSON.stringify({ updated_item }),
            }
        );
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
