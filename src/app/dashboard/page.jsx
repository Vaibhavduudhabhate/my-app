"use client"
import Boxes from "@/components/Boxes";
import Comnavbar from "@/components/Comnavbar";
import { Server, Info, ArrowDown, ArrowUp, Flag } from "feather-icons-react";
import { TabBox } from "@/components/TabBox";
import { useEffect, useRef, useState } from "react";
import DailyReportTable from "@/components/DailyReportTable";
export default function Dashboard() {
  const [userData, setUserData] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const fetcPropertyBlockData = useRef(); // one time call property block api 
  useEffect(() => {
    if (fetcPropertyBlockData.current) return;
    fetcPropertyBlockData.current = true;
    fetchData();

  }, [refreshData]);
  // property report block api define start
  const fetchData = async () => {
    try {
      const response = await fetch('/api/propertyReport-blocks', { method: "GET", cache: "no-cache" });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const records = await response.json();
      // console.log("records", records)
      setUserData(records);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // property report block api define end

  useEffect(()=>{
    const sw = async() =>{
      checkPermission();
      await requestNotificationPermission();
      await registerSW();
    }
    sw()
  },[])

  const summaryTab = [
    { name: "Collections", key: "collections" },
    { name: "Delinquency", key: "delinquency" },
    { name: "Forward-Looking Occupancy", key: "Forward-Looking-occupancy" },
  ];

  /** Tab props end**/
  const allData = {
    collections: [
      "collection-analytics-list-item"
    ],
    delinquency: [
      "delinquency-analytics-list-item"
    ],
    "Forward-Looking-occupancy": [
      "occupancy-analytics-list-item"
    ],
  };

  var CreatedDate = userData;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
  
    const options = { month: 'long' };
    const day = String(date.getDate()).padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', options).format(date);
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  };

  const columnsConfig = [
    { header: "Property Name", accessorKey: "propertyDetails.property_name" },
    { header: "Date of Report", accessorKey: "createdAt" },
    { header: "Submitted By", accessorKey: "submitted_by" },
    { header: "Collection Details", accessorKey: "totalCollection" },
    { header: "Delinquency Details", accessorKey: "currentMonthDeliquency" },
    { header: "Occupancy Details", accessorKey: "occupiedUnits" },
    { header: "Status", accessorKey: "status" },
    { header: "Action", accessorKey: "action" },
  ];
  // const [arrow,setArrow] = useState();
  const percentageConvert = (percentageValue) => {
    percentageValue = percentageValue && percentageValue.includes("%")
    ? percentageValue.replace("%", "")
    : percentageValue;
    const conversionToNumInt = parseInt(percentageValue);
    console.log(conversionToNumInt);
    
    const conversionToNum = parseFloat(percentageValue);
    const formattedNum = conversionToNum.toFixed(2);
    return <span className={`${conversionToNumInt > 0 ? "text-[#039855]" : "text[#D92D20]"}`}>{formattedNum}%</span>
  }
  function formatIndianNumber(number) {

    
    const numberStr = number && number.toString();
  
    // Split the number into the integer part
    const integerPart = numberStr && numberStr.split('.')[0];
    
    // Handle cases for numbers with more than three digits
    const lastThree = integerPart && integerPart.slice(-3);
    const otherDigits = integerPart && integerPart.slice(0, -3);
  
    // Add commas to the remaining digits in groups of two
    const formattedOtherDigits = otherDigits && otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
    // Combine the formatted parts
    return formattedOtherDigits ? `${formattedOtherDigits},${lastThree}` : lastThree;
  }
  return (
    <>
      <Comnavbar
        comHeading="Dashboard"
        comPara="Your overview hub for seamless management."
      />
      <div className="p-8 text-gray-900">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Boxes
            boxLeftTitle={"Collections"}
            boxLeftIcon={Server}
            boxValue={`$${formatIndianNumber(userData && userData.current_month && Object.keys(userData).length > 0 && userData.current_month.collection) || 0}`}
            boxPercentageValue={percentageConvert(userData && userData.current_month && userData.current_month.collection_change || 0)}
            arraowIcon={parseInt(userData?.current_month?.collection_change) > 0 ? (ArrowUp) : (ArrowDown)}
            ArraowIconColor={parseInt(userData?.current_month?.collection_change) > 0 ? ("text-039855") : ("text-D92D20")}
            popoverContent={<div className="flex flex-col gap-1"><div><p className="font-sm text-A4A4A9">Rent Collected</p><span className="text-base text-white">{userData && userData.current_month && userData.current_month.rent_collected || 0}</span></div><div><p className="font-sm text-A4A4A9">Other Income</p><span className="text-base text-white">{userData && userData.current_month && userData.current_month.other_income || 0}</span></div></div>}
            // popoverContent={<div>This is popover content for Delinquency.</div>}
            popoverBoxWidth="w-36"
            popoverLeftPosition="left-5"
          />
          <Boxes
            boxLeftTitle={"Delinquency"}
            boxLeftIcon={Flag}
            boxValue={`$${formatIndianNumber(userData && userData.current_month && userData.current_month.delinquency || 0)}`}
            boxPercentageValue={percentageConvert(userData && userData.current_month && userData.current_month.delinquency_change || 0)}
            arraowIcon={parseInt(userData?.current_month?.delinquency_change) > 0 ? (ArrowUp) : (ArrowDown)}
            ArraowIconColor={parseInt(userData?.current_month?.delinquency_change) > 0 ? ("text-039855") : ("text-D92D20")}
            popoverContent={<div className="flex flex-col gap-1"><div><p className="font-sm text-A4A4A9">Total Billed</p><span className="text-base text-white">3,16,312.94</span></div><div><p className="font-sm text-A4A4A9">Total Collected</p><span className="text-base text-white">2,16,312.94</span></div></div>}
            popoverBoxWidth="w-36"
            popoverLeftPosition="left-5"
          />
          <Boxes
            boxLeftTitle={"Forward-Looking Occupancy"}
            boxLeftIcon={Server}
            boxValue={`${userData && userData.current_month && userData.current_month.occupancy.toFixed(2) || 0}%`}
            boxPercentageValue={percentageConvert(userData && userData.current_month && userData.current_month.occupancy_change || 0)}
            arraowIcon={parseInt(userData?.current_month?.occupancy_change) > 0 ? (ArrowUp) : (ArrowDown)}
            ArraowIconColor={parseInt(userData?.current_month?.occupancy_change) > 0 ? ("text-039855") : ("text-D92D20")}
            popoverContent={
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div><p className="font-sm text-A4A4A9">No. of Occupied</p><span className="text-base text-white">169</span></div>
                  <div><p className="font-sm text-A4A4A9">No. of move-outs</p><span className="text-base text-white">{userData && userData.current_month && userData.current_month.move_out || 0}</span></div>
                  <div><p className="font-sm text-A4A4A9">Total Net Occupancy</p><span className="text-base text-white">{userData && userData.current_month && userData.current_month.Total_Net_occupancy || 0}</span></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div><p className="font-sm text-A4A4A9">No. of Occupied</p><span className="text-base text-white">161</span></div>
                  <div><p className="font-sm text-A4A4A9">No. of approved move-ins</p><span className="text-base text-white">{userData && userData.current_month && userData.current_month.move_in || 0}</span></div>
                </div>
              </div>}
            popoverBoxWidth="w-80"
            popoverLeftPosition="-left-40"
          />
          {/* 
          <div className="p-4 bg-white border-2 border-A4A4A9">
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-2">
                <h4>Forward-Looking Occupancy</h4>
                <div className="flex justify-end">
                  <span>
                    <Server className="w-16.67 h-16.67 bg-slate-200 rounded-full" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 m-1.5 ">
                <h2 className="text-text-3.5xl font-semibold leading-9.5">
                96.02%
                </h2>
                <span>
                  <Info className="w-4 h-4 text-22222E" />
                </span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <ArrowUp className="w-4 h-4 mt-0.6 text-039855" />
              <h6>10%</h6>
              vs
              <p>last month</p>
            </div>
          </div> */}
        </div>
        <div className="mb-3 bg-white p-4 border-1x border-A4A4A9">
         
          <TabBox
            summaryTab={summaryTab}
            summaryTabContent={allData}
            areaChart="true"
            displayMonthYearFilter="true"
            displaySingleGraphTab="true"
            makeApicall="false"
            makePropertyAllCall="false"
          />
        </div>
        <div className="bg-white">
          <h1 className="text-lg text-101828 pt-4 pl-2">Last 5 reports</h1>
            <DailyReportTable maximumDisplayData={5} apiEndPoint="/api/latest-5-records" makePropertyApiCall="false" />
        </div>
      </div>
    </>
  );
}

const checkPermission = () => {
  if (!('serviceWorker' in navigator)) {
      throw new Error("No support for service worker!")
  }

  if (!('Notification' in window)) {
      throw new Error("No support for notification API");
  }

  if (!('PushManager' in window)) {
      throw new Error("No support for Push API")
  }
}

const registerSW = async () => {
  const registration = await navigator.serviceWorker.register('/sw.js');
  return registration;
}

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
      throw new Error("Notification permission not granted")
  }

}
