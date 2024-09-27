import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { user_id } = requestBody;
        console.log("requestBody",requestBody)
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/user-read-item/?user_id=${user_id}`,
            {
                method: "GET",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
            }
        );

        const data = await response.json();
        console.log(data)
        return NextResponse.json({
            message: "User property retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Error while retrieving user properties:", error);
        return NextResponse.json(
            { message: "Error while retrieving user properties" },
            { status: 500 }
        );
    }
}
