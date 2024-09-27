"use client";
import { useState, useEffect, useRef } from "react";
import AreaChart from "./AreaChart";
import PropertyTab from "./PropertyTab";
import { SelectDropdown } from "./SelectDropdown";
import DatepickerBox from "./DatepickerBox";
import OverlapAreaChart from "./OverlapAreaChart";

export const TabBox = ({
  summaryTab,
  summaryTabContent,
  areaChart,
  propertyTab,
  displayMonthYearFilter,
  displayPropertyDateFilter,
  displayOverlayChart,
  displayCurrentMPreviousMFilter,
  displayMultiGraphTab,
  displaySingleGraphTab,
  makeApicall,
  displayPropertydataTabs,
  makePropertyAllCall
}) => {
  // console.log("summaryTabContent", makeApicall);
  const [activeTab, setActiveTab] = useState(0);
  const [secactiveTab, setsecActiveTab] = useState(0);
  const [activeTabKey, setActiveTabKey] = useState("collections");
  const [secactiveTabKey, setsecActiveTabKey] = useState("collections");
  const [fetchDatatabs, setFetchDatatabs] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSingleGraphLoading, setIsSingleGraphLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [propertyData, setPropertyData] = useState(false);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [property_id, setPropertyId] = useState([]);
  const [token, setToken] = useState();
  const isModalVisibleRef = useRef(false);
  const getActiveTabUrl = useRef();
  const fetchUserList = useRef(false);
  const fetchGraphData = useRef(false);
  const fetchOverlayGraphData = useRef(false);
  // console.log(summaryTab);
  // last 12 months function code start
  // const getLast12Months = () => {
  //   const months = [];
  //   const currentDate = new Date();

  //   for (let i = 0; i < 12; i++) {
  //     const year = currentDate.getFullYear();
  //     const month = currentDate.getMonth() + 1; // getMonth is zero-based

  //     const label = currentDate.toLocaleString("default", { month: "short" });
  //     const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  //     months.push({ label: `${label} ${year}`, month: formattedMonth, year });

  //     // Move to the previous month
  //     currentDate.setMonth(currentDate.getMonth() - 1);
  //   }

  //   return months;
  // };
  // const monthArray = getLast12Months();
  const [currentMonth, setCurrentMonth] = useState("");

  const [previousMonth, setPreviousMonth] = useState("");

  // useEffect(() => {
  //   const now = new Date();
  //   const currentMonthIndex = 0; // The current month is at index 0 in the generated array
  //   const previousMonthIndex = 1; // The previous month is at index 1 in the generated array

  //   // Set the current and previous months
  //   setCurrentMonth(monthArray[currentMonthIndex].month);
  //   setPreviousMonth(monthArray[previousMonthIndex].month);
  // }, [monthArray]);
  const [monthArray, setMonthArray] = useState([]);

  useEffect(() => {
    const getLast12Months = () => {
      const months = [];
      const currentDate = new Date();

      for (let i = 0; i < 12; i++) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth is zero-based

        const label = currentDate.toLocaleString("default", { month: "short" });
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        // Push the full value in "MM-YYYY" format
        months.push({
          label: `${label} ${year}`,
          fullValue: `${formattedMonth}-${year}`,
        });

        // Move to the previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
      }

      return months;
    };

    const months = getLast12Months();
    setMonthArray(months); // Update the monthArray state

    // Set the current and previous months using the "MM-YYYY" format
    setCurrentMonth(months[0].fullValue);
    setPreviousMonth(months[1].fullValue);
  }, []);

  const handleCurrentMonthChange = (event) => {
    // alert('')
    setCurrentMonth(event.target.value);
    // setBothValuesChanged(true);
  };
  const handlePreviousMonthChange = (event) => {
    setPreviousMonth(event.target.value);
    // setBothValuesChanged(true);
  };
  // const authToken = cookies.authToken;
  useEffect(() => {
    
    // console.log("filterValue", property_id);
    // const authHeader = request.headers.get("authorization");
    // alert(authHeader)
    const tabKey = summaryTab[activeTab]?.key; // Get the key of the active tab
    if (tabKey) {
      // Fetch data based on the active tab's key
      const url = summaryTabContent[tabKey]; // Get the URL for the active tab
      // console.log(url[0]);
      getActiveTabUrl.current = url
      if (fetchGraphData.current) return;
      fetchGraphData.current = true;
      fetchData();
      // fetchData(url)
      //   .then(json => setData(json))
      //   .catch(error => console.error("Error fetching data:", error));
    }
  }, [activeTab, filterValue, property_id]);
  const fetchData = async () => {
    // console.log(getActiveTabUrl);
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard-graph-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: getActiveTabUrl.current[0],
          filterValue,
          property_id,
        }),
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      // console.log("records", isSingleGraphLoading); // For debugging
      setFetchDatatabs(records);
      setIsLoading(false);
      // setanalyticsData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (fetchUserList.current) return;
    fetchUserList.current = true;
    if(makePropertyAllCall == true){
      propdata();
    }
  }, [makePropertyAllCall]);
  const propdata = async () => {
    try {
      const response = await fetch("/api/get-all-property", {
        method: "POST",
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      // console.log("setPropertyData", records); // For debugging
      setPropertyData(records.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // console.log(currentMonth, previousMonth);
    // setLastCurrentMonth(currentMonth);
    // setLastPreviousMonth(previousMonth);
    // console.log(lastCurrentMonth);
    // console.log(lastPreviousMonth);

    if (makeApicall == "true") {
      // alert("")
      const tabKey = summaryTab[secactiveTab]?.key; // Get the key of the active tab
      if (tabKey) {
        // Fetch data based on the active tab's key
        const url = summaryTabContent[tabKey]; // Get the URL for the active tab
        // console.log(url[0]);
        fetchOverlayGraphData.current = url;

        fetchOverlayData();
      }
    }
  }, [secactiveTab, currentMonth, previousMonth]);
  const fetchOverlayData = async () => {
    if (currentMonth && previousMonth) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/overlay-graph", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: fetchOverlayGraphData.current[0],
            currentMonth,
            previousMonth,
          }),
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const records = await response.json();
        // console.log("records", records); // For debugging
        setFetchDatatabs(records);
        setIsLoading(false);
        // setanalyticsData(records);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (currentMonth == "" && previousMonth == "") {
      setIsLoading(true);
      try {
        const response = await fetch("/api/overlay-graph", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: url[0],
            currentMonth,
            previousMonth,
          }),
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const records = await response.json();
        // console.log("records", records); // For debugging
        setFetchDatatabs(records);
        setIsLoading(false);
        // setanalyticsData(records);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
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
    setSelectedOptions((prevSelected) => {
      let updatedSelected;

      if (prevSelected.includes(option)) {
        // Remove the option if it's already selected
        updatedSelected = prevSelected.filter((id) => id !== option);
      } else {
        // Add the option if it's not selected
        updatedSelected = [...prevSelected, option];
      }

      // Concatenate the selected options into a string
      const concatenatedString = updatedSelected.join(",");
      // console.log("concatenatedString",concatenatedString);

      // Update the other array with the concatenated string
      setPropertyId(concatenatedString);
      fetchGraphData.current = false;

      return updatedSelected;
    });
  };

  // useEffect(() => {
  //   console.log("Updated array:", updatedArray);
  // }, [updatedArray]);

  const mdy = [
    // { value: "Daily", label: "Daily" },
    { value: "", label: "Monthly" },
    { value: "yes", label: "Yearly" },
  ];
  // datepicker values start
  const handleDateChange = (date) => {
    // setSelectedDate(date);
    // console.log("Selected Date in Parent:", date);
    fetchGraphData.current = false;
    setFilterValue(date);

  };
  // datepicker values start
  return (
    <>
      {displayMonthYearFilter != undefined && (
        <div className="grid grid-cols-2 gap-4 items-center mb-4">
          <div>
            <h3 className="text-lg leading-7">Summary statistics</h3>
          </div>
          <div className="text-right">
            <div className="relative">
              <select
                onChange={(e) => {
                  fetchGraphData.current = false
                  setFilterValue(e.target.value);
                }}
                className="appearance-none px-[14px] py-[10px] pr-[27px] bg-white border-1x border-22222E placeholder-slate-400 focus:outline-none"
              >
                {mdy.map(({ value, label }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-22222E"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      {displayPropertyDateFilter != undefined && (
        <div className="flex justify-between flex-wrap items-center mb-4">
          <div className="w-full md:w-4/12 mb-2 md:mb-0">
            <h3 className="text-lg font-normal text-101828">Historical Data</h3>
          </div>
          <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
              {/* <select
                                id="property_id"
                                name="property_id"
                                // value={formik.values.property_id}  onChange={formik.handleChange}
                                className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            >
                                <option selected>All Properties</option>
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
                            </select> */}
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <div>
                  <button
                    type="button"
                    id="dropdownToggle"
                    onClick={handleToggleClick}
                    className={`inline-flex items-center min-w-72 h-10 justify-between w-full pr-7 pl-4 border border-22222E shadow-sm bg-white text-base font-medium ${
                      selectedOptions.length == 0
                        ? "text-slate-400"
                        : "text-black"
                    } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}
                  >
                    {/* {selectedOptions.length > 0
              ? selectedOptions
                  .map((property_id) => propertyData.find((o) => o.property_id === property_id)?.property_name)
                  .join(', ')
              : 'Select Options'}
            <span className="">&#9662;</span> */}
                    {selectedOptions.length == 0
                      ? "Select Properties"
                      : "Selected Properties " + selectedOptions.length}
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
              <DatepickerBox onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
      )}
      {displayCurrentMPreviousMFilter != undefined && (
        <div className="flex justify-between flex-wrap items-center mb-4">
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
                value={currentMonth}
                onChange={handleCurrentMonthChange}
              >
                <option value="" selected>
                  Select Month
                </option>
                {monthArray.map(({ label, fullValue }) => (
                  <option key={fullValue} value={fullValue}>
                    {label}
                  </option>
                ))}
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
                value={previousMonth}
                onChange={handlePreviousMonthChange}
              >
                <option value="" selected>
                  Select Month
                </option>
                {monthArray.map(({ label, fullValue }) => (
                  <option key={fullValue} value={fullValue}>
                    {label}
                  </option>
                ))}
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
        </div>
      )}
      {displaySingleGraphTab != undefined && (
        <div className="tabs">
          <ul className="flex pb-6">
            {summaryTab.map((tab, index) => (
              // console.log(index)
              <li
                key={index}
                className={`mr-8 border-b-2 text-lg leading-7 cursor-pointer ${
                  activeTab === index
                    ? "border-22222E text-22222E"
                    : "border-white text-667085"
                }`}
                onClick={() => {
                  setActiveTab(index); // First state update
                  setActiveTabKey(tab.key); // Second state update (this should probably be a different state setter function)
                  fetchGraphData.current = false;
                }}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div>
            {/* <div>{summaryTabContent[activeTab]}</div> */}
            {areaChart != undefined && fetchDatatabs && (
              <AreaChart
                data={fetchDatatabs}
                showLoading={isLoading}
                activeKey={activeTabKey}
                filter={filterValue}
              />
              // <></>
            )}
            {propertyTab != undefined && (
              <PropertyTab data={summaryTabContent} activeKey={activeTabKey} />
            )}
            {/* {
              displayOverlayChart != undefined && (
                <OverlapAreaChart showLoading={isLoading} activeKey={activeTabKey} data={fetchDatatabs} />
              )
            } */}
          </div>
        </div>
      )}
      {displayMultiGraphTab != undefined && (
        <div className="tabs">
          <ul className="flex pb-6">
            {summaryTab.map((tab, index) => (
              // console.log(index)
              <li
                key={index}
                className={`mr-8 border-b-2 text-lg leading-7 cursor-pointer ${
                  secactiveTab === index
                    ? "border-22222E text-22222E"
                    : "border-white text-667085"
                }`}
                onClick={() => {
                  setsecActiveTab(index); // First state update
                  setsecActiveTabKey(tab.key); // Second state update (this should probably be a different state setter function)
                }}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div>
            {displayOverlayChart != undefined && (
              <OverlapAreaChart
                showLoading={isLoading}
                activeKey={activeTabKey}
                data={fetchDatatabs}
              />
            )}
          </div>
        </div>
      )}
      {displayPropertydataTabs != undefined && (
        <div className="tabs">
          <ul className="flex pb-6">
            {summaryTab.map((tab, index) => (
              // console.log(index)
              <li
                key={index}
                className={`mr-8 border-b-2 text-lg leading-7 cursor-pointer ${
                  activeTab === index
                    ? "border-22222E text-22222E"
                    : "border-white text-667085"
                }`}
                onClick={() => {
                  setActiveTab(index); // First state update
                  setActiveTabKey(tab.key); // Second state update (this should probably be a different state setter function)
                }}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div>
            {propertyTab != undefined && (
              <PropertyTab data={summaryTabContent} activeKey={activeTabKey} />
            )}
          </div>
        </div>
      )}
    </>
  );
};
