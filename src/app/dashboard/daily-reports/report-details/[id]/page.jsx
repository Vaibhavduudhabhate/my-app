"use client"
import PropertyTab from '@/components/PropertyTab'
import { TabBox } from '@/components/TabBox'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useAuthStore from '@/store/AuthStore'
import DailyReportTabBox from '@/components/DailyReportTabBox'
import Loading from '@/components/Loading'
const EditreportForm = () => {

    const [dailyData, setDailyData ] = useState();
    const [allPropertyData, setAllPropertyData ] = useState();
    const [isLoading, setisLoading] = useState(false);
    const {storedToken} = useAuthStore();
    const {id} = useParams();
    // console.log("id...");
    // console.log(id);

  

useEffect(()=>{

    const getAllProperty = async() =>{
        try {
        const response = await fetch(`/api/get-all-property`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}` 
            },
            body: JSON.stringify({ report_id: id }),
        });

        // if (!response.ok) {
        //     throw new Error(`Error: ${response.statusText}`);
        // }

        const data = await response.json();
        console.log("property data...");
        console.log(data);
        setAllPropertyData(data.data);

        } catch (err) {
        setError(err.message);
        console.log(err);
        }
    }
    const fetchData = async () => {
        setisLoading(true)
        try {
          const response = await fetch(`/api/daily-report-read/?report_id=${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ report_id: id }),
          });
  
        //   if (!response.ok) {
        //     throw new Error(`Error: ${response.statusText}`);
        //   }
  
          const data = await response.json();
          console.log("data...");
          console.log(data.data);
          setDailyData(data.data);

        } catch (err) {
          setError(err.message);
          console.log(err);
        }finally{
            setisLoading(false)
        }
      };
      getAllProperty();
      fetchData();
    // console.log("dailyData");
    // console.log(dailyData);
    // console.log("allPropertyData");
    // console.log(allPropertyData);
},[id])
    

    const summaryTab = [
        { name: "Collections", key: "collections" }, 
        { name: "Delinquency", key: "delinquency" }, 
        { name: "Forward-Looking Occupancy", key: "Forward-Looking-occupancy" }
    ]

// const data = [
//     { 
//         "price": "$2,00,256", 
//         "label": "Current month to date" 
//     },
//     { 
//         "price": "$24,000", 
//         "label": "Last month to date" 
//     },
//     { 
//         "price": "$2,24,256", 
//         "label": "Difference" 
//     }
//   ];
//   const data2 = [
//     { "price": "$2,00,256", "label": "Current month to date" },
//     { "price": "$24,000", "label": "Last month to date" },
//     { "price": "$2,24,256", "label": "Difference" }
//   ];

  const allData ={
      collections:[
        { "price": "$2,00,256", "label": "Current month to date" },
        { "price": "$24,000", "label": "Last month to date" },
        { "price": "$2,24,256", "label": "Difference" }
      ],
      delinquency: [
        { "price": "$2,00,257", "label": "Current month to date" },
        { "price": "$24,001", "label": "Last month to date" },
        { "price": "$2,24,258", "label": "Difference" }
      ],
      "Forward-Looking-occupancy":[
        { "price": "$2,00,258", "label": "Current month to date" },
        { "price": "$24,002", "label": "Last month to date" },
        { "price": "$2,24,259", "label": "Difference" }
      ]
    }
// const summaryTabContent = [
//     <PropertyTab key="Collections" data={data2} />,
//     <PropertyTab key="Delinquency"  data={data2}/>,
//     <PropertyTab key="Forward-Looking Occupancy" data={data2} />
// ]

  return (
    <div className="p-8">
         <div className="bg-E9E9EA flex  px-3 py-2.5 border-1x border-A4A4A9 mb-3">
            <Link href="/dashboard/daily-reports" className="text-base font-semibold text-101828">Daily Reports</Link>
            <span className="mx-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L15 12L9 19" stroke="#22222E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </span>
            <span className="text-base text-667085 font-semibold">Report Details</span>
        </div>
        <div className="p-4 bg-white border-1x border-A4A4A9 mb-3">
            <div className="border-b-[1px] border-D0D5DD pb-2 mb-3">
            <h4 className="text-base font-semibold text-101828">Property data</h4>
            <p className="text-sm font-normal text-344054">Data of your property collection</p>
            </div>
            <DailyReportTabBox summaryTab={summaryTab} summaryTabContent={allData} />
            {/* <TabBox summaryTab={summaryTab} summaryTabContent={allData} propertyTab="true" displayPropertydataTabs="true" /> */}
        </div>
        {isLoading ? (<Loading />): dailyData &&
            Object.keys(dailyData).length > 0 && (
        <div className="p-4 bg-white border-1x border-A4A4A9">
            <div className="border-b-[1px] border-D0D5DD pb-2 mb-3">
            <h4 className="text-base font-semibold text-101828">Detailed Property data report</h4>
            <p className="text-sm font-normal text-344054">Detailed property data report</p>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Property Information</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Select Property</div>
                <div className="text-base text-101828 font-normal">
                    {/* {dailyData.property_id} */}
                    {allPropertyData && allPropertyData.length > 0 && allPropertyData
                     .filter(item => item.property_id === dailyData.property_id)
                     .map((item)=>(   
                        <span key={item.property_id}>{item.property_name}</span>
                    ))}    
                </div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Select Date</div>
                <div className="text-base text-101828 font-normal">{dailyData.propertyDate}</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Collection Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Rent Collected</div>
                <div className="text-base text-101828 font-normal">{dailyData.rentCollected}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Other Income</div>
                <div className="text-base text-101828 font-normal">{dailyData.otherIncome}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Collection</div>
                <div className="text-base text-101828 font-normal">{dailyData.totalCollection}</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Delinquency Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
                
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Current month Delinquency</div>
                <div className="text-base text-101828 font-normal">{dailyData.currentMonthDeliquency}</div>
            </div>
            
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Prior month Delinquency</div>
                <div className="text-base text-101828 font-normal">{dailyData.priorMonthDeliquency}</div>
            </div>
            {/* <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Billed</div>
                <div className="text-base text-101828 font-normal">{dailyData.totalUnits}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Collected</div>
                <div className="text-base text-101828 font-normal">{dailyData.totalCollection}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Delinquency Amount</div>
                <div className="text-base text-101828 font-normal">{dailyData.currentMonthDeliquency}</div>
            </div> */}
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Occupancy Data</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Occupied</div>
                <div className="text-base text-101828 font-normal">{dailyData.occupiedUnits}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Vacant</div>
                <div className="text-base text-101828 font-normal">{dailyData.vacantUnits}</div>
            </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of move-outs</div>
                <div className="text-base text-101828 font-normal">{dailyData.noOfMoveOuts}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of approved move-ins</div>
                <div className="text-base text-101828 font-normal">{dailyData.approvedMoveIns}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">Total Net Occupancy</div>
                <div className="text-base text-101828 font-normal">{dailyData.totalUnits}</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Property Applications and Tours</div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-2 mb-4">
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Pending Applications</div>
                <div className="text-base text-101828 font-normal">{dailyData.pendingApplications}</div>
            </div>
            <div className="py-2 px-4 w-full md:flex-1 bg-E9E9EA mb-1.5">
                <div className="text-sm text-344054 font-normal mb-1">No. of Tours Conducted today</div>
                <div className="text-base text-101828 font-normal">{dailyData.toursConductedToday}</div>
            </div>
            </div>
            <div className="text-base font-semibold text-101828 mb-1.5">Additional Notes</div>
            <div className="py-2 px-4 w-full bg-E9E9EA">
                <div className="text-base text-101828 font-normal">{dailyData.comments}</div>
            </div>
            </div>
        )}
        </div>
  )
}

export default EditreportForm