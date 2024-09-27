import { NextResponse } from "next/server";
export async function POST(request) {
    const body = await request.json();
    // console.log(body);
    
    const {endpoint, filterValue,property_id } = body
    // console.log(property_id);
    
    
  const authHeader = request.headers.get("authorization");
    try {
        
      // const response = await fetch(`${process.env.api_end_point}/${endpoint}?year=${filterValue}`, {
        // const response = await fetch(`${process.env.api_end_point}/${endpoint}?year=${filterValue}&start_date=${filterValue.startDate != null && filterValue.startDate}&end_date=${filterValue.endDate != null && filterValue.endDate}`, {
        const response = await fetch(`${process.env.api_end_point}/${endpoint}?year=${filterValue}&start_date=${filterValue && filterValue.startDate}&end_date=${filterValue && filterValue.endDate}&property_id=${property_id}`, {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.subscription_key, 
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(selectedIds),
        cache: 'no-cache'  
      }, {revalidate:5});
    
      const data = await response.json();
      // console.log(data);
      
    return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error while retrieving user properties' }, { status: 500 }); 
    }
  }