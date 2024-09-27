import { NextResponse } from "next/server";

export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    try {
        const requestBody = await request.json();
        console.log("request", requestBody);
        const { report_id } = requestBody;
        const response = await fetch(
            `${process.env.api_end_point}/propertyReport-delete-item/?report_id=${report_id}`,
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
        console.error("Error deleting properties:", error);
        return NextResponse.json(
            { message: "Error deleting properties" },
            { status: 500 }
        );
    }
}
