// "use client";
import Comnavbar from "@/components/Comnavbar";
import Table from "@/components/Table";
// import React, { useEffect, useState } from "react";
// import { Plus } from "feather-icons-react";
import Loading from "@/components/Loading";
import DailyReportTable from "@/components/DailyReportTable";

const DailyReport = () => {
    // const [reportData, setReportData] = useState([]);
    // const [refreshData, setRefreshData] = useState(false);
    // const [propertyData, setPropertyData] = useState(false);
    // const [selectedProperty, setSelectedProperty] = useState("");
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000); 
    // }, [reportData]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch("/api/daily-report-listing", {
    //                 method: "GET",
    //                 cache: "no-cache",
    //             });
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             const records = await response.json();
    //             // console.log("records", records); // For debugging
    //             setReportData(records);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, [refreshData]);

    // useEffect(() => {
    //     const propdata = async () => {
    //         try {
    //             const response = await fetch("/api/get-all-property", {
    //                 method: "POST",
    //                 cache: "no-cache",
    //             });
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             const records = await response.json();
    //             console.log("setPropertyData", records); // For debugging
    //             setPropertyData(records.data);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };
    //     propdata();
    // }, [refreshData]);

    // Toggle refreshData to re-fetch data
    // const handleDataChange = () => {
    //     setRefreshData((prev) => !prev);
    // };

    // const handlePropertyChange = (event) => {
    //     setSelectedProperty(event.target.value);
    // };

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     if (isNaN(date.getTime())) return null;

    //     const options = { month: "long" };
    //     const day = String(date.getDate()).padStart(2, "0");
    //     const month = new Intl.DateTimeFormat("en-US", options).format(date);
    //     const year = date.getFullYear();

    //     return `${day} ${month} ${year}`;
    // };

    // Function to update `createdAt` fields in the original data
    // const updateCreatedAtFieldsInPlace = (data) => {
    //     data.forEach((item) => {
    //         // Update `createdAt` field at top level
    //         if (item.createdAt) {
    //             item.createdAt = formatDate(item.createdAt);
    //         }

    //         // Update `createdAt` field inside `propertyDetails` if it exists
    //         if (item.propertyDetails && item.propertyDetails.createdAt) {
    //             item.propertyDetails.createdAt = formatDate(
    //                 item.propertyDetails.createdAt
    //             );
    //         }
    //     });
    // };

    // updateCreatedAtFieldsInPlace(reportData);
    // const columnsConfig = [
    //     {
    //         header: "Property Name",
    //         accessorKey: "propertyDetails.property_name",
    //     },
    //     { header: "Date of Report", accessorKey: "createdAt" },
    //     { header: "Name", accessorKey: "userDetails.username" },
    //     { header: "Collection Details", accessorKey: "totalCollection" },
    //     {
    //         header: "Delinquency Details",
    //         accessorKey: "currentMonthDeliquency",
    //     },
    //     { header: "Occupancy Details", accessorKey: "occupiedUnits" },
    //     { header: "Status", accessorKey: "status" },
    //     { header: "Action", accessorKey: "action" },
    // ];

    // let filteredData = [];
    // if (selectedProperty === "") {
    //     filteredData = reportData; // Show all data if no property is selected
    // } else if (selectedProperty === "All Properties") {
    //     filteredData = reportData;
    // } else {
    //     filteredData = reportData && reportData.filter(
    //         (item) => item.property_id === selectedProperty
    //     );
    // }
    // console.log(filteredData);
    // console.log("hi");
    return (
        <>
            <Comnavbar
                comHeading="Daily Reports"
                comPara="Track daily progress and insights effortlessly. Stay informed with real-time updates and detailed analytics."
                showLinkButton={true}
                givenLink="/dashboard/daily-reports/new-report"
                linkTitle="Add New Report"
                // linkIcon={Plus}
            />
            <div className="m-8 bg-white text-black border-1x border-border-A4A4A9">
                {/* <div className="p-4 flex justify-between flex-wrap items-center">
                    <div className="w-full md:w-4/12 mb-2 md:mb-0">
                        <h3 className="text-lg font-normal text-101828">
                            List of Reports
                        </h3>
                    </div>
                    <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
                        <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
                            <select
                                id="countries"
                                className="appearance-none pl-4 min-w-72 pr-7 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                onChange={handlePropertyChange}
                                value={selectedProperty}
                            >
                                <option selected="">All Properties</option>
                                {propertyData && propertyData.length > 0 ? (
                                    propertyData.map((item) => (
                                        <option
                                            value={item.property_id}
                                            key={item.property_id}
                                        >
                                            {item.property_name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>
                                        No properties available
                                    </option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg
                                    width="13"
                                    height="7"
                                    viewBox="0 0 13 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.5 1L6.5 6L11.5 1"
                                        stroke="#22222E"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <button
                            className="md:ml-2 flex items-center border-1x border-black text-E6EAEB leading-10 bg-custom_bg_button text-15151C text-lg py-0 px-5 font-semibold h-10"
                            type="button"
                        >
                            <svg
                                className="mr-2"
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 13V16.3333C18 16.7754 17.8244 17.1993 17.5118 17.5118C17.1993 17.8244 16.7754 18 16.3333 18H4.66667C4.22464 18 3.80072 17.8244 3.48816 17.5118C3.17559 17.1993 3 16.7754 3 16.3333V13M6.33333 8.83333L10.5 13M10.5 13L14.6667 8.83333M10.5 13V3"
                                    stroke="white"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>{" "}
                            Export
                        </button>
                    </div>
                </div> */}
                {/* <Table /> */}
                {/* {
                 isLoading ? (
                    <Loading />
                ) :filteredData.length === 0 ? (
                    <div className="p-4 text-center">No records found</div>
                ) : ( */}
                    {/* <Table
                        key={selectedProperty}
                        pageName="daily_reports"
                        data={filteredData}
                        showPaginationButton="true"
                        maximumDisplayData={10}
                        columnsConfig={columnsConfig}
                        displayLinkWithIcon="true"
                        displayVerticalIcon="true"
                    /> */}
                    <DailyReportTable maximumDisplayData={10} showpaginationButtons="true" showFilterOnPage="true" apiEndPoint="/api/daily-report-listing" makePropertyApiCall={true}  />
                {/* )} */}
            </div>
        </>
    );
};

export default DailyReport;
