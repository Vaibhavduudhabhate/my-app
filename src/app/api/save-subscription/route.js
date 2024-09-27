export async function POST(request) {
    console.log("request", request);
    try {
        const authHeader = request.headers.get("authorization");
        const subscription = await request.json();
        console.log(subscription);

        if (!subscription || !subscription.endpoint) {
            return new Response(
                JSON.stringify({ error: "Invalid subscription data" }),
                { status: 400 }
            );
        }

        const apiResponse = await fetch(
            `${process.env.api_end_point}/user-subscription-create-item`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                body: JSON.stringify(subscription),
            }
        );

        if (!apiResponse.ok) {
            throw new Error(
                `Failed to save subscription, status: ${apiResponse.status}`
            );
        }

        const apiData = await apiResponse.json();
        console.log("API Response:", apiData);

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error("Error saving subscription:", error);
        return new Response(
            JSON.stringify({ error: "Failed to save subscription" }),
            { status: 500 }
        );
    }
}
