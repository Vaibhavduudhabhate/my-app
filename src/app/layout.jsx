import { Lato } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/store/AuthStore";
const inter = Lato({
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
});

export const metadata = {
    title: "RAMP",
    description: "RAMP-Login",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} h-full`}>
                {children}
                <ToastContainer className="mr-[var(--scrollbar-width,0)]" />
            </body>
        </html>
    );
}
