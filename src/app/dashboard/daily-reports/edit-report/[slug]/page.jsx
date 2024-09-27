"use client";
import reportCurrencyData from "@/utilitis/report_currency";
import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NewReportForm from "@/components/NewReportForm";

const Page = () => {
    const [propertyData, setPropertyData] = useState();
    const [editPropertyData, setEditPropertyData] = useState();

    const { slug } = useParams();

    const currencyData = reportCurrencyData;

    useEffect(() => {
        const getProperty = async () => {
            try {
                const response = await fetch(`/api/get-all-property`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                setPropertyData(data.data);
            } catch (err) {
                console.error("Error get all property:", err);
            }
        };
        /****/
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/daily-report-read/?report_id=${slug}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ report_id: slug }),
                    }
                );
                const data = await response.json();
                setEditPropertyData(data.data);
            } catch (err) {
                setError(err.message);
                console.log(err);
            }
        };
        getProperty();
        fetchData();
    }, []);

    return (
        <div className="p-8">
            <div className="bg-E9E9EA flex  px-3 py-2.5 border-1x border-border-A4A4A9 mb-3">
                <Link
                    href="/dashboard/daily-reports"
                    className="text-base font-semibold text-101828"
                >
                    Daily Reports
                </Link>
                <span className="mx-4">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 5L15 12L9 19"
                            stroke="#22222E"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <span className="text-base text-667085 font-semibold">
                    Edit Report
                </span>
            </div>
            <div className="p-4 bg-white border-1x border-border-A4A4A9">
                <NewReportForm
                    propertyData={propertyData}
                    currencyData={currencyData}
                    editPropertyData={editPropertyData}
                />
            </div>
        </div>
    );
};

export default Page;
