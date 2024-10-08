"use client";
import { Roboto } from "next/font/google";
import Sidebar from "@/partials/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const inter = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
});

export default function Layout({ children }) {
    const navigate = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuthStore(); // Assume isLoading indicates auth state loading
    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return; // Skip the first effect execution to avoid premature redirect
        }

        if (!isLoading) {
            if (isAuthenticated && pathname === "/") {
                navigate.push("/dashboard/user-management");
            } else if (!isAuthenticated && pathname !== "/") {
                navigate.push("/");
            }
        }
    }, [isAuthenticated, isLoading, pathname, navigate, isInitialRender]);

    if (isLoading || isInitialRender) {
        return null; // Render nothing while auth state is loading
    }

    return (
        <>
            <section className="flex">
                <Sidebar />
                {/* <div className="w-full bg-slate-200 2xl:translate-x-[288px] xl:translate-x-[288px] lg:translate-x-0 md:translate-x-0 sm:translate-x-0 translate-x-0 transition-transform duration-500"> */}
                <div className="w-full bg-slate-200 2xl:pl-72 xl:pl-72 lg:pl-0 md:pl-0 sm:pl-0 pl-0">
                    {children}
                </div>
            </section>
        </>
    );
}
