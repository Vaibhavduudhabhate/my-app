import { NextResponse } from "next/server";
export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json();
  // console.log("body", body);
  const {current_page , filteredReportData} = body
  
    try {
      // const response = await fetch(`https://820b-2401-4900-56fc-1357-8b92-4977-f602-7734.ngrok-free.app/api/get-all-propertyReport-item`, {
      const response = await fetch(`${process.env.api_end_point}/get-all-propertyReport-item?page=${current_page}&property_id=${filteredReportData}`, {
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