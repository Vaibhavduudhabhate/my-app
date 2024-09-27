import { NextResponse } from "next/server";

export async function middleware(request) {
    // Get cookies from the request headers
    const cookieHeader = request.headers.get("cookie") || "";

    // Function to parse cookies
    const parseCookies = (cookieHeader) => {
        const cookies = {};
        cookieHeader.split(";").forEach((cookie) => {
            const [name, value] = cookie.split("=");
            cookies[name.trim()] = value ? value.trim() : "";
        });
        return cookies;
    };

    // Parse cookies
    const cookies = parseCookies(cookieHeader);
    const token = cookies.authToken;

    // Modify the request if the token exists
    const modifiedRequest = new Request(request, {
        headers: {
            ...request.headers,
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

    return NextResponse.next({ request: modifiedRequest });
}

export const config = {
    matcher: [
        "/api/:path((?!loginApi$).*)", // Matches all /api routes except /api/login
    ],
};
