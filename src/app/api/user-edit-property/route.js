import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const requestBody = await request.json();
        console.log("requestBody",requestBody)
        const { user_id, updated_item } = requestBody;

        const editedValues = {
            // username: username,
            updated_item,
        };
        console.log(editedValues);
        const response = await fetch(
            `${process.env.api_end_point}/user-update-item/?user_id=${user_id}`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                body: JSON.stringify({ updated_item }),
            }
        );

        const data = await response.json();
        return NextResponse.json({
            message: "User property retrieved successfully",
        });
    } catch (error) {
        console.error("Error while retrieving user properties:", error);
        return NextResponse.json(
            { message: "Error while retrieving user properties" },
            { status: 500 }
        );
    }
}
