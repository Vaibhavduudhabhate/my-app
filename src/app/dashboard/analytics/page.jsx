"use client";
import Comnavbar from "@/components/Comnavbar";
import { TabBox } from "@/components/TabBox";
import Table from "@/components/Table";
import React, { useEffect, useRef, useState } from "react";
import DatepickerBox from "@/components/DatepickerBox";
import Loading from "@/components/Loading";
import DailyReportTable from "@/components/DailyReportTable";

const Analytics = () => {
  const [analyticsData, setanalyticsData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [propertyData, setPropertyData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState("");
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // setAnalyticsData(data); // Replace with actual data fetching logic
      // setFilteredData(data);  // Replace with actual filtering logic
      setIsLoading(false);
    }, 1000); // Simulate a delay of 1 second
  }, [analyticsData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/daily-report-listing", {
  //         method: "GET",
  //         cache: "no-cache",
  //       });
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const records = await response.json();
  //       // console.log("records", records); // For debugging
  //       setanalyticsData(records);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [refreshData]);

  // useEffect(() => {
  //   const propdata = async () => {
  //     try {
  //       const response = await fetch("/api/get-all-property", {
  //         method: "POST",
  //         cache: "no-cache",
  //       });
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const records = await response.json();
  //       // console.log("setPropertyData", records); // For debugging
  //       setPropertyData(records.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   propdata();
  // }, [refreshData]);

  // Toggle refreshData to re-fetch data
  const handleDataChange = () => {
    setRefreshData((prev) => !prev);
  };

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };

  const summaryTab = [
    { name: "Collections", key: "collections" },
    { name: "Delinquency", key: "delinquency" },
    { name: "Forward-Looking Occupancy", key: "Forward-Looking-occupancy" },
  ];
  const allData = {
    collections: ["collection-analytics-list-item"],
    delinquency: ["delinquency-analytics-list-item"],
    "Forward-Looking-occupancy": ["occupancy-analytics-list-item"],
  };
  const overLaydata = {
    collections: ["collection-analytics-sum-item"],
    delinquency: ["delinquency-analytics-sum-item"],
    "Forward-Looking-occupancy": ["occupancy-analytics-sum-item"],
  };
  
  // console.log(overLaydata);
  
  const columnsConfig = [
    {
      header: "Property Name",
      accessorKey: "propertyDetails.property_name",
    },
    { header: "Date of Report", accessorKey: "createdAt" },
    { header: "Submitted By", accessorKey: "submitted_by" },
    { header: "Collection Details", accessorKey: "totalCollection" },
    {
      header: "Delinquency Details",
      accessorKey: "currentMonthDeliquency",
    },
    { header: "Occupancy Details", accessorKey: "occupiedUnits" },
    { header: "Status", accessorKey: "status" },
    { header: "Action", accessorKey: "action" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const options = { month: "long" };
    const day = String(date.getDate()).padStart(2, "0");
    const month = new Intl.DateTimeFormat("en-US", options).format(date);
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // Function to update `createdAt` fields in the original data
  const updateCreatedAtFieldsInPlace = (data) => {
    data.forEach((item) => {
      // Update `createdAt` field at top level
      if (item.createdAt) {
        item.createdAt = formatDate(item.createdAt);
      }

      // Update `createdAt` field inside `propertyDetails` if it exists
      if (item.propertyDetails && item.propertyDetails.createdAt) {
        item.propertyDetails.createdAt = formatDate(
          item.propertyDetails.createdAt
        );
      }
    });
  };

  updateCreatedAtFieldsInPlace(analyticsData);

  const toggleDropdown = (id) => {
    setIsOpen(isOpen === id ? null : id);
  };
  const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  const handleOptionToggle = (option) => {
    // alert(option)
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((id) => id !== option)
        : [...prevSelected, option]
    );
  };
  let filteredData = [];
  if (selectedProperty === "") {
    filteredData = propertyData; // Show all data if no property is selected
  } else if (selectedProperty === "All Properties") {
    filteredData = propertyData;
  } else {
    filteredData =
      propertyData &&
      propertyData.filter((item) => item.property_id === selectedProperty);
  }
  return (
    <>
      <Comnavbar
        comHeading="Analytics"
        comPara="Dive deep into data-driven decisions with comprehensive analytics and visualizations."
        givenLink="#"
      />
      <div className="mx-[32px] mt-[32px] mb-[12px] bg-white text-black p-4">
        {/* <div className="flex justify-between flex-wrap items-center mb-4">
          <div className="w-full md:w-4/12 mb-2 md:mb-0">
            <h3 className="text-lg font-normal text-101828">Historical Data</h3>
          </div>
          <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <div>
                  <button
                    type="button"
                    id="dropdownToggle"
                    onClick={handleToggleClick}
                    className={`inline-flex items-center min-w-72 h-10 justify-between w-full pr-7 pl-4 border border-22222E shadow-sm bg-white text-base font-medium ${selectedOptions.length == 0 ? "text-slate-400" : "text-black"} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`} 
                  >
                    {selectedOptions.length == 0 ? "Select Properties" : "Selected Properties " + selectedOptions.length}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div
                    id="dropdownMenu"
                    className="origin-top-right absolute mt-2 w-full h-36 overflow-y-scroll rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="py-1">
                      {propertyData.length > 0 &&
                        propertyData.map((property) => (
                          <a
                            key={property.property_id}
                            href="javascript:void(0);"
                            onClick={() =>
                              handleOptionToggle(property.property_id)
                            }
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                              selectedOptions.includes(property.property_id)
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedOptions.includes(
                                property.property_id
                              )}
                              onChange={() =>
                                handleOptionToggle(property.property_id)
                              }
                              className="mr-2"
                            />
                            {property.property_name}
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
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
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
              <DatepickerBox />
            </div>
          </div>
        </div> */}
        <TabBox
          summaryTab={summaryTab}
          summaryTabContent={allData}
          areaChart="true"
          displayPropertyDateFilter="true"
          displaySingleGraphTab="true"
          makeApicall={false}
          makePropertyAllCall={true}
        />
      </div>
      <div className="mx-[32px] mt-[] mb-[12px] bg-white text-black p-4">
        {/* <div className="flex justify-between flex-wrap items-center mb-4">
          <div className="w-full md:w-4/12 mb-2 md:mb-0">
            <h3 className="text-lg font-normal text-101828">
              Comparison between
            </h3>
          </div>
          <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
              <select
                id="currentMonth"
                className="appearance-none pl-4 min-w-72 pr-7 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
              >
                <option selected="">Current Month (May)</option>
                <option value="May">Current Month (May)</option>
                <option value="June">Current Month (June)</option>
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
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
              <select
                id="countries"
                className="appearance-none pl-4 min-w-72 pr-7 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
              >
                <option selected="">Previous Month (April)</option>
                <option value="April">Previous Month (April)</option>
                <option value="May">Previous Month (May)</option>
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
          </div>
        </div> */}
        <TabBox
          summaryTab={summaryTab}
          summaryTabContent={overLaydata}
          // areaChart="true"
          displayCurrentMPreviousMFilter="true"
          displayOverlayChart="true"
          displayMultiGraphTab="true"
          makeApicall="true"
        />
      </div>
      <div className="mx-[32px] bg-white text-black">
        <div className="p-4 pb-0 flex justify-between flex-wrap items-center">
          <div className="w-full md:w-4/12 mb-2 md:mb-0">
            <h3 className="text-lg font-normal text-101828">Analytics</h3>
          </div>
          {/* <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
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
                    </div> */}
        </div>

        {isLoading ? (
          <Loading />
        ) : filteredData.length === 0 ? (
          <div className="p-4 text-center">No records found</div>
        ) : (
          // <Table
          //     key={selectedProperty}
          //     data={filteredData}
          //     pageName="daily_reports"
          //     showPaginationButton="true"
          //     maximumDisplayData={10}
          //     columnsConfig={columnsConfig}
          //     displayLinkWithIcon="true"
          //     displayVerticalIcon="true"
          // />
          <DailyReportTable
            maximumDisplayData={10}
            showpaginationButtons="true"
            showFilterOnPage="true"
            apiEndPoint="/api/daily-report-listing"
            makePropertyApiCall={true}
          />
        )}
        {/* // : (
      //   <Loading />
      // )} */}
      </div>
    </>
  );
};

export default Analytics;
