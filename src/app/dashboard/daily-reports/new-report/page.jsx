import ReportForm from "@/components/ReportForm";
import reportCurrencyData from "@/utilitis/report_currency";
import Link from "next/link";
import React from "react";

const Newreport = async () => {
    const currencyData = reportCurrencyData;
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
                    Add new Report
                </span>
            </div>
            <div className="p-4 bg-white border-1x border-border-A4A4A9">
                <ReportForm currencyData={currencyData} />
            </div>
        </div>
    );
};

export default Newreport;
