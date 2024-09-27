import { NextResponse } from "next/server";
export async function POST(request) {
    const { user_id } = await request.json();
    const authHeader = request.headers.get("authorization");
    try {
        const response = await fetch(
            `${process.env.api_end_point}/user-delete-item/?user_id=${user_id}`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
            }
        );

        return NextResponse.json({
            message: "user property Deleted Successfully",
        });
    } catch (error) {
        console.error("Error while deleting user properties:", error);
        return NextResponse.json(
            { message: "Error while deleting user properties" },
            { status: 500 }
        );
    }
}
