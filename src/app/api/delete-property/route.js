import { NextResponse } from "next/server";

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    const { property_id } = await request.json();
    try {
        const response = await fetch(
            `${process.env.api_end_point}/property-delete-item/?property_id=${property_id}`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
            }
        );

        return NextResponse.json({ message: "Deleted Successfull" });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json(
            { message: "Error fetching properties" },
            { status: 500 }
        );
    }
}
