// import AreaChart from '@/components/AreaChart'
import { TabBox } from '@/components/TabBox'
import Link from 'next/link'
import React from 'react'

const EditReport = () => {
/** Select dropdown props start**/ 
const mdy = [
    { value: "Daily", label: "Daily"},
    { value: "Monthly", label: "Monthly"},
    { value: "Yearly", label: "Yearly"},
]
/** Select dropdown props end**/ 
const summaryTab = ["Collections", "Delinquency", "Forward-Looking Occupancy"]
// console.log("hello world");
  return (
    <div className="p-8">
         <div className="bg-E9E9EA flex  px-3 py-2.5 border-1x border-A4A4A9 mb-3">
            <Link href="/dashboard/daily-reports" className="text-base font-semibold text-101828">Daily Reports</Link>
            <span className="mx-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L15 12L9 19" stroke="#22222E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </span>
            <span>Report Details</span>
        </div>
        <div className="p-4 bg-white border-1x border-A4A4A9 mb-3">
            <div className="border-b-[1px] border-D0D5DD pb-2 mb-3">
            <h4 className="text-base font-semibold text-101828">Property data</h4>
            <p className="text-sm font-normal text-344054">Data of your property collection</p>
            </div>
            {/* <TabBox summaryTab={summaryTab} summaryTabContent={summaryTabContent}/> */}
        </div>
        <div className="p-4 bg-white border-1x border-A4A4A9">
            <div className="border-b-[1px] border-D0D5DD pb-2 mb-3">
            <h4 className="text-base font-semibold text-101828">Detailed Property data report</h4>
            <p className="text-sm font-normal text-344054">Detailed property data report</p>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Property Information</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Select Property</div>
                <div className="text-base text-101828 font-normal">Hyde Park</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Select Property</div>
                <div className="text-base text-101828 font-normal">Hyde Park</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Collection Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Rent Collected</div>
                <div className="text-base text-101828 font-normal">$2,00,312</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Other Income</div>
                <div className="text-base text-101828 font-normal">$16,000.94</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Collection</div>
                <div className="text-base text-101828 font-normal">$2,16,312.94</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Delinquency Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Billed</div>
                <div className="text-base text-101828 font-normal">$3,16,312.94</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Collected</div>
                <div className="text-base text-101828 font-normal">$2,16,312.94</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Delinquency Amount</div>
                <div className="text-base text-101828 font-normal">$1,00,000.00</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Occupancy Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Occupied</div>
                <div className="text-base text-101828 font-normal">169</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Vacant</div>
                <div className="text-base text-101828 font-normal">7</div>
            </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of move-outs</div>
                <div className="text-base text-101828 font-normal">2</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of approved move-ins</div>
                <div className="text-base text-101828 font-normal">2</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Net Occupancy</div>
                <div className="text-base text-101828 font-normal">171</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Property Applications and Tours</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Pending Applications</div>
                <div className="text-base text-101828 font-normal">0</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Tours Conducted today</div>
                <div className="text-base text-101828 font-normal">0</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Additional Notes</div>
            <div className="py-2 px-4 w-full bg-E9E9EA">
                <div className="text-base text-101828 font-normal">Overall, Hyde Park has seen steady occupancy rates this month, maintaining a strong presence in the market. Collections have been consistent, although there has been a slight increase in delinquency compared to last month.</div>
            </div>
            </div>
        </div>
  )
}

export default EditReport