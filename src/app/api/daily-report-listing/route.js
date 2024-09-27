import { NextResponse } from "next/server";
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
    try {
        
      const response = await fetch(`${process.env.api_end_point}/get-all-propertyReport-item`, {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.subscription_key, 
          Authorization: authHeader,
        },
        cache: 'no-cache'  
      }, {revalidate:5});
    
      const data = await response.json();
    return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error while retrieving user properties' }, { status: 500 }); 
    }
  }