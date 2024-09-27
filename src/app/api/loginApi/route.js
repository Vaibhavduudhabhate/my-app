import { NextResponse } from 'next/server';
import { toast } from 'react-toastify';

export async function POST(request) {
    try {
        const requestBody = await request.json();

        const response = await fetch(`${process.env.api_end_point}/login-item`, {
            method: "POST",
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.subscription_key
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }

        return NextResponse.json({ message: data.data.message, data, status:200 });
    } catch (error) {
        console.log("Here is error:", error);
        return NextResponse.json({ message: 'Error while Log In' , status: 401 });
    }
}