import { NextResponse } from "next/server";
export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        const response = await fetch(
            `${process.env.api_end_point}/get-all-property-item`,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.subscription_key,
                    Authorization: authHeader,
                },
                cache: "no-cache",
            },
            { revalidate: 5 }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: "Error while retrieving user properties" },
            { status: 500 }
        );
    }
}

// // Options for the fetch request
// export async function fetchDeleteProperty(propertyId) {
//   console.log("propertyId", propertyId);
// const options = {
//   method: 'POST',
//   headers: {
//     'Ocp-Apim-Subscription-Key': nextConfig.env.subscription_key,
//   },
// };

// // Making the fetch request
// fetch(`${nextConfig.env.api_end_point}/property-delete-item/`, options)
//   .then(response => {
//     // if (!response.ok) {
//     //   throw new Error('Network response was not ok ' + response.statusText);
//     // }
//     return response.json(); // or response.text() if you expect a text response
//   })
//   .then(data => {
//     console.log('Resource deleted successfully:', data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   })
// }
