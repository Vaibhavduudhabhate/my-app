import { NextResponse } from "next/server";
export async function POST(request) {
    const body = await request.json();
    // console.log(body);
    const {notification_id} = body
    const objectItem = {
        "updated_item":{
           "status":"read"
        }
      }
    console.log(objectItem);
    
  const authHeader = request.headers.get("authorization");
    try {
        
      const response = await fetch(`${process.env.api_end_point}/userNotification-update-item?notification_id=${notification_id}`, {
        method: "POST",
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.subscription_key, 
          Authorization: authHeader,
        },
        body: JSON.stringify(objectItem),
        cache: 'no-cache'  
      });
      console.log("notification",response)
      const data = await response.json();
    return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error while retrieving user properties' }, { status: 500 }); 
    }
  }