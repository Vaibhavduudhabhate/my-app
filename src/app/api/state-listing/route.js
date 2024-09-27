import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      const authHeader = request.headers.get("authorization");
      const response = await fetch(
          `${process.env.api_end_point}/get-all-state-item`,
          {
              headers: {
                  "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                  Authorization: authHeader,
              },
          },
          { cache: "no-cache" }
      );

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error while retrieving state listing' }, { status: 500 });
    }
  }
