import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { property_id } = requestBody;
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/property-read-item?property_id=${property_id}`,
            {
                method: "GET",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
            }
        );
        console.log("response....");
        console.log(response);
        const data = await response.json();
        console.log("user data...", data);

        return NextResponse.json({
            message: "property management retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Error while retrieving management properties:", error);
        return NextResponse.json(
            { message: "Error while retrieving properties management" },
            { status: 500 }
        );
    }
}
