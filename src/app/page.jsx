"use client";
import Button from "../components/Button";
import logoHorizotal from "../../public/logoHorizontal.png";
import Link from "next/link";
import { useFormik } from "formik";
import {
    loginDefaultValue,
    loginValidationSchema,
} from "@/validation/loginValidation";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Home() {
    const authStore = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [responseLogin, setResponseLogin] = useState(false);
    const navigate = useRouter();
    const formik = useFormik({
        initialValues: loginDefaultValue,
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const login = await fetch("/api/loginApi", {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });
                const response = await login.json();
                if (response.status == 401) {
                    toast.error("Incorrect Email or Password");
                    setResponseLogin(false);
                }
                if (response.status == 200) {
                    setResponseLogin(true);
                    toast.success("Login Successfully", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    authStore.setAuth({
                        isAuthenticated: true,
                        storedToken: response.data.token,
                        storedUsername: response.data.data.userFullName,
                        storedUserId: response.data.data.id,
                        storedEmail: response.data.data.email,
                        storedRole: response.data.data.role,
                    });

                    Cookies.set("authToken", response.data.token, {
                        expires: 7,
                        secure: process.env.NODE_ENV === "production", 
                        sameSite: "strict", 
                    });

                    navigate.push("/dashboard");
                }
            } catch (error) {
                toast.error("Bad request");
            } finally {
                setIsLoading(false); 
            }
        },
    });
    useEffect(() => {
        if (authStore.isAuthenticated) {
            navigate.push("/dashboard");
        } else {
            navigate.push("/");
        }
    }, [authStore, navigate]);
    return (
        <main className="grid grid-cols-2 border-2 py-10 px-12 gap-20">
            <div className="p-8 bg-theme_primary_bg">
                <div className="mb-12">
                    <img src="/logoHorizontal.png" alt="" />
                </div>
                <div className="mb-12">
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Reynolds Asset Management Portal (RAMP)
                    </h1>
                    <p className="text-white">
                        Streamlining Property Management with Real-Time Data and
                        Insights
                    </p>
                </div>
                <div>
                    <img src="/login.png" alt="" />
                </div>
            </div>
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-black text-4xl font-semibold mb-4 leading-9.5">
                        Welcome
                    </h1>
                    <h3 className="text-black text-lg">
                        Log in to your account
                    </h3>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-6">
                            <div className="sm:col-span-4 pb-1.5">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-semibold leading-6 text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1">
                                    <div className="flex shadow-sm ring-1 h-13 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                       <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            placeholder="olivia@untitledui.com"
                                            autoComplete="username"
                                            className="block flex-1 border-0 bg-transparent py-2.5 px-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 shadow-4xl"
                                        />
                                    </div>
                                    {formik.touched.email &&
                                        formik.errors.email && (
                                            <div className="error text-red text-sm font-normal mt-1.5">
                                                {formik.errors.email}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-semibold leading-6 text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <div className="flex shadow-sm h-13 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            placeholder="Enter Your Password"
                                            autoComplete="username"
                                            className="block flex-1 border-0 bg-transparent py-2.5 px-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 shadow-4xl"
                                        />
                                    </div>
                                    {formik.touched.password &&
                                        formik.errors.password && (
                                            <div className="error text-red text-sm font-normal mt-1.5">
                                                {formik.errors.password}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <p className="text-black text-end mt-4 text-sm">
                                <Link
                                    href="javascript:void(0)"
                                    className="hover:text-sky-700 hover:underline hover:underline-offset-1"
                                >
                                    Forget Password ?
                                </Link>
                            </p>
                        </div>
                        {!isLoading ? (
                            <Button
                                btnType="submit"
                                displayButton="true"
                                title="Log In"
                                bgColor="bg-custom_bg_button"
                                width="w-full"
                                padding_top_bottom="py-4"
                                padding_left_right="px-7"
                                height="h-18"
                                border_width="border"
                                border_color="border-7F56D9"
                                disabled={responseLogin}
                                title_color="text-white"
                            />
                        ) : (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    disabled
                                    className="py-4 px-7 flex justify-center items-center bg-custom_bg_button focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full h-18 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        className="mr-2 animate-spin"
                                        viewBox="0 0 1792 1792"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                                    </svg>
                                    Loading
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
