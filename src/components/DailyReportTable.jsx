"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ArrowLeft,
  ArrowRight,Eye
} from "feather-icons-react";
import ConfirmatioModal from "./ConfirmationBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import Link from "next/link";
import { mkConfig, generateCsv, download } from 'export-to-csv'

const DailyReportTable = ({
  maximumDisplayData,
  showpaginationButtons,
  showFilterOnPage,
  apiEndPoint,
  displayLinkWithIcon,
  makePropertyApiCall // property call 
}) => {
  const [reportData, setReportData] = useState([]);
  const [intialdata, setIntialdata] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport_id, setselectedReport_id] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: maximumDisplayData, //default page size
  });
  const [current_page, setCurrent_page] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const verticalDropDown = useRef(null);
  const loading = useRef(false);
  const loadingReportData = useRef("true");
  const [error,setError] = useState(false);
  const isError = useRef();
  const [propertyData, setPropertyData] = useState(false); //storing property data
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const fetchDailyReportdata = useRef(); // call daily report api one time
  const fetchDailyReportPropertyApi = useRef(); // calling property api in daily report table oen time

// export excel code start
const exportExcel = (rows) => {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    filename: 'sample', // export file name (without .csv)
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  // Define the columns you want to include in the CSV
  const columnMapping = {
    property_name: 'Property Name',
    currency: 'Currency',
    rentCollected: 'Rent Collected',
    otherIncome: 'Other Income',
    totalCollection: 'Total Collection',
    grossCollection: 'Gross Collection',
    currentMonthDeliquency: 'Current Month Deliquency',
    priorMonthDeliquency: 'Prior Month Deliquency',
    totalUnits: 'Total Units',
    occupiedUnits: 'Occupied Units',
    noOfMoveOuts: 'No of Move Outs',
    approvedMoveIns: 'Approved Move Ins',
    vacantUnits: 'Vacant Units',
    pendingApplications: 'Pending Applications',
    toursConductedToday: 'Tours Conducted Today',
    status: 'Status',
    comments: 'Comments'
  };

  // Convert rows to the format needed for CSV generation
  const rowData = rows.map((row) => {
    const original = row.original;

    // Extract the required fields, including nested ones
    return {
      [columnMapping.property_name]: original.propertyDetails.property_name,
      [columnMapping.currency]: original.currency,
      [columnMapping.rentCollected]: original.rentCollected,
      [columnMapping.otherIncome]: original.otherIncome,
      [columnMapping.totalCollection]: original.totalCollection,
      [columnMapping.grossCollection]: original.grossCollection,
      [columnMapping.currentMonthDeliquency]: original.currentMonthDeliquency,
      [columnMapping.priorMonthDeliquency]: original.priorMonthDeliquency,
      [columnMapping.totalUnits]: original.totalUnits,
      [columnMapping.occupiedUnits]: original.occupiedUnits,
      [columnMapping.noOfMoveOuts]: original.noOfMoveOuts,
      [columnMapping.approvedMoveIns]: original.approvedMoveIns,
      [columnMapping.vacantUnits]: original.vacantUnits,
      [columnMapping.pendingApplications]: original.pendingApplications,
      [columnMapping.toursConductedToday]: original.toursConductedToday,
      [columnMapping.status]: original.status,
      [columnMapping.comments]: original.comments,
    };
  });

  // Generate CSV from rowData
  const csv = generateCsv(csvConfig)(rowData);

  // Trigger download of the generated CSV
  download(csvConfig)(csv);
};

// export excel code end

  const toggleDropdown = (id) => {
    // alert()
    setIsOpen(isOpen === id ? null : id);
  };
  const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const columns = [
    {
      accessorKey: "property_name",
      header: "Property Name",
      cell: (props) => {
        const property_name =
          props.row.original.propertyDetails &&
          props.row.original.propertyDetails.property_name;
        return property_name;
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date of Report",
      cell: (props) => {
        const rawDate = props.getValue();
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return null;

        const options = { month: "long" };
        const day = String(date.getDate()).padStart(2, "0");
        const month = new Intl.DateTimeFormat("en-US", options).format(date);
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
      },
    },
    {
      accessorKey: "userFullName",
      header: "Name",
      cell: (props) => {
        const userName =
          props.row.original.userDetails &&
          props.row.original.userDetails.userFullName;
        return userName || "NA";
      },
      enableSorting: false,
    },
    {
      accessorKey: "totalCollection",
      header: "Collection Details",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: true,
    },
    {
      accessorKey: "currentMonthDeliquency",
      header: "Delinquency Details",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: true,
    },
    {
      accessorKey: "occupiedUnits",
      header: "Occupancy Details",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => {
        // console.log(props.getValue());

        const status = props.getValue() || "NA";
        const statusClass =
          status && status.toLowerCase() === "active" ? "active" : "inactive";

        return (
          <p className={`statuses ${statusClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </p>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (props) => {
        const rowId = props.row.original.id;
        // console.log(rowId);
        // console.log("row.original.id", props.row.original.id);
        const handleAllDelete = () => {
          setIsModalOpen(true);
          setselectedReport_id(rowId);
        };
        return (
          <div className="flex">
                              {/* {displayLinkWithIcon !== undefined && ( */}
                    {/* // console.log(slug) */}

                    <Link
                      href={`/dashboard/daily-reports/report-details/${props.row.original.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2.5" />
                    </Link>
                    {/* // <></> */}
                  {/* )} */}
            <MoreVertical
              className="w-4 h-4 cursor-pointer relative"
              aria-expanded={isOpen === props.row.original.id}
              aria-haspopup="true"
              onClick={() =>
                toggleDropdown(
                  // row.original
                  //     .property_id ||
                  props.row.original.id
                )
              }
            />

            {isOpen === props.row.original.id && (
              <div
                ref={verticalDropDown}
                className="z-50 origin-top-right absolute right-9 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {/* <Link
                    className="hidden"
                    href={`/dashboard/daily-reports/edit-report/${row.original.id}`}
                  >
                    Edit
                  </Link> */}

                  <a
                    href="javascript:void(0)"
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-300 hover:text-blue-800"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                    onClick={() => handleAllDelete()}
                  >
                    {/* <Trash /> */}
                    Delete
                  </a>
                </div>
              </div>
            )}
            {/* EditDelete Dropdoen end */}
          </div>
        );
      },
      enableSorting: false,
    },
  ];
  const handleDailyReportFinalDelete = async (report_id) => {
    try {
      const response = await fetch(`/api/daily-report-delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report_id: report_id }),
      });

      if (response.status == 200) {
        setIsModalOpen(false);
        toast.success("Report deleted successfully!");
        // setTimeout(() => {
        //     window.location.reload();
        // }, 2000);
        // actionRef.current = "clicked";
      }
      setReportData(
        reportData.filter((property) => property.id !== report_id)
        // property.report_id !== report_id
      );
    } catch (error) {
      // setError.current = "true"
      // alert('Error deleting property');
    }
  };
  useEffect(()=>{
    if (fetchDailyReportdata.current) return;
    fetchDailyReportdata.current = true;
    fetchData();
  },[current_page, filteredReportData])
  // api define to call daily report listing start
  const fetchData = async () => {
    loadingReportData.current = "true";
    try {
      const response = await fetch(`${apiEndPoint}`, {
        method: "POST",
        body: JSON.stringify({
          current_page,
          filteredReportData,
        }),
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      console.log("records", records); // For debugging
      switch(true){
        case records && records.data && Array.isArray(records.data) :
          setReportData(records);
          setIntialdata(records);
          setFilteredData(records);
          setError(false);
          break;
        case records && !Array.isArray(records) :
          setError(true);
          break;
      }
      // setReportData(records);
      // setIntialdata(records);
      // setFilteredData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true)
    } finally{
      loadingReportData.current = "false";
    }
  };
  // api define to call daily report listing end

 
  useEffect(() => {
    if(makePropertyApiCall == true){
      if (fetchDailyReportPropertyApi.current) return;
      fetchDailyReportPropertyApi.current = true;
      propdata();
    }
  }, []);
   //   api call for fetching property data data start
   const propdata = async () => {
    try {
      loading.current = "true"
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
      isError.current = "true"
    }
    finally {
      loading.current = "false" 
  }
  };
  //   api call for fetching all daily report data end
  const table = useReactTable({
    columns,
    data: reportData.data || [],
    state: {
      pagination, // Ensure this is your pagination state
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
  });
  const totalPages = Math.ceil(reportData.length / pagination.pageSize);
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page numbers to show at once
    const currentPage = pagination.pageIndex;
    const totalPageCount = totalPages;

    if (totalPageCount <= maxPagesToShow) {
      for (let i = 0; i < totalPageCount; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        0,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const endPage = Math.min(
        totalPageCount - 1,
        startPage + maxPagesToShow - 1
      );

      if (startPage > 0) {
        pageNumbers.push(0);
        if (startPage > 1) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPageCount - 1) {
        if (endPage < totalPageCount - 2) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPageCount - 1);
      }
    }

    return pageNumbers;
  };
  // pagination logic based on api
  const handlePageChange = async (newPage) => {
    // console.log(newPage);
    if (newPage < 1 || newPage > reportData.total_page) {
      return;
    }
    fetchDailyReportdata.current = false
    loadingReportData.current = "true";
    setCurrent_page(newPage);
  };
  // useEffect(() => {
  //   if (selectedOptions.length === 0) {
  //     setError(false)
  //     setReportData(intialdata); // Show all data if no option is selected
  //   } else {
  //     const filteredData = intialdata.filter((item) =>
  //       selectedOptions.includes(item.propertyDetails.property_id)
  //     );
  //     // console.log(filteredData);
      
  //     if (filteredData.length == 0) {
  //       // alert("")
  //       setError(true)
  //     }
  //     else{
  //       // Update the user data with the filtered data
  //       // setError.current = "false";
  //       setError(false)
  //       setReportData(filteredData);
  //     }
  //   }
  // }, [selectedOptions, intialdata]);
  const handleCheckboxChange = (property_id) => {
    const newSelectedOptions = selectedOptions.includes(property_id)
      ? selectedOptions.filter((id) => id !== property_id)
      : [...selectedOptions, property_id];
    setSelectedOptions(newSelectedOptions);
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (verticalDropDown.current && !verticalDropDown.current.contains(event.target)) {
        setIsOpen(null);
      }
    };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [verticalDropDown]);
  const handleOptionToggle = (option) => {
    // console.log(selectedOptions);
    
    setSelectedOptions((prevSelected) =>{
      // console.log(prevSelected);
      
      let updatedSelected;
      if (prevSelected.includes(option)) {
        // Remove the option if it's already selected
        updatedSelected = prevSelected.filter((id) => id !== option);
      } else {
        // Add the option if it's not selected
        updatedSelected = [...prevSelected, option];
      }
      // console.log("concatenatedString",updatedSelected);
      setFilteredReportData(updatedSelected);
      fetchDailyReportdata.current = false;
      loadingReportData.current = "true";
      return updatedSelected;
      // prevSelected.includes(option)
      //   ? prevSelected.filter((id) => id !== option)
      //   : [...prevSelected, option]
      // }
  });
    // setSelectedOptions((prevSelected) => {
    //   let updatedSelected;

    //   if (prevSelected.includes(option)) {
    //     // Remove the option if it's already selected
    //     updatedSelected = prevSelected.filter((id) => id !== option);
    //   } else {
    //     // Add the option if it's not selected
    //     updatedSelected = [...prevSelected, option];
    //   }
    //   console.log("concatenatedString",updatedSelected);

    //   // Concatenate the selected options into a string
    //   // const concatenatedString = updatedSelected.join(",");

    //   // // Update the other array with the concatenated string
    //   // setPropertyId(concatenatedString);
    //   // fetchGraphData.current = false;

    //   // return updatedSelected;
    // });
    
  };
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  return (
    <>
      {showFilterOnPage != undefined && (
        <div className="p-4 flex justify-between flex-wrap items-center">
          <div className="w-full md:w-4/12 mb-2 md:mb-0">
            <h3 className="text-lg font-normal text-101828">List of Reports</h3>
          </div>
          <div className="w-full md:w-8/12 2xl:flex xl:flex lg:flex md:flex flex-wrap justify-start md:justify-end sm:grid sm:grid-cols-2 sm:gap-[5px] block">
            <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto sm:w-auto">
              <div
                className="relative inline-block text-left 2xl:w-auto xl:w-auto lg:w-auto md:w-auto sm:w-auto w-full"
                ref={dropdownRef}
              >
                <div>
                  <button
                    type="button"
                    id="dropdownToggle"
                    onClick={handleToggleClick}
                    className="inline-flex items-center min-w-72 h-10 justify-between w-full pr-7 pl-4 border border-22222E shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 max-[340px]:min-w-full"
                  >
                    {/* {selectedOptions.length > 0
              ? selectedOptions
                  .map((property_id) => propertyData.find((o) => o.property_id === property_id)?.property_name)
                  .join(', ')
              : 'Select Options'}
            <span className="">&#9662;</span> */}
                    {/* Select Properties */}
                    {selectedOptions.length == 0 ? "Select Properties" : selectedOptions.length + " Properties Selected"}
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
            <button
              className="md:ml-2 flex items-center border-1x border-black text-E6EAEB leading-10 bg-custom_bg_button text-15151C text-lg py-0 px-5 font-semibold h-10 2xl:w-auto xl:w-auto lg:w-auto md:w-auto sm:w-auto sm:justify-center justify-center w-full"
              type="button"
              onClick={() => exportExcel(table.getFilteredRowModel().rows)}
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
        </div>
      )}
      {loadingReportData.current == "true" ? (
        <Loading />
      ) : error || isError.current == "true" ? (
        <table className="w-full">
          <tbody>
            <tr>
              <td
                colSpan={table.getHeaderGroups()[0].headers.length}
                className="text-center py-[100px] text-xl text-344054 font-normal"
              >
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <div className="p-4">
            <div className="outer-table-div overflow-x-auto">
              <table className="2xl:min-w-full divide-y divide-D0D5DD divide-dashed">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr className="tr" key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          className="th relative pl-0 pr-4 py-3 text-left text-sm font-normal text-667085 uppercase tracking-wider whitespace-nowrap align-bottom"
                          key={header.id}
                        >
                          {header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <span
                              className="forArrow inline-block relative top-1.5"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="cursor-pointer" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="cursor-pointer" />
                              ) : (
                                <ChevronUp className="cursor-pointer" />
                              )}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-D0D5DD divide-dashed">
                  {table.getRowModel().rows.map((row) => (
                    // console.log(row)
                    <tr className="tr" key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className="td pl-0 pr-4 py-4 whitespace-normal text-sm text-344054 font-normal"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* pagination start */}
            {showpaginationButtons != undefined && (
              <div className="flex justify-between items-center mt-4 py-3 max-[415px]:justify-center max-[415px]:gap-[5px]">
                <button
                  // onClick={() =>
                  //   table.setPageIndex(
                  //     table.getState().pagination.pageIndex - 1
                  //   )
                  // }
                  onClick={() =>
                    handlePageChange(reportData.page - 1)
                  }
                  disabled={
                    reportData.page === 1
                  }
                  className={`border border-D0D5DD font-semibold px-3.5 py-2 flex text-344054 text-sm gap-2 ${reportData.page === 1 ? "cursor-not-allowed bg-[#cbd5e0]" : "cursor-pointer"}`}
                >
                  <ArrowLeft className="text-344054 w-5 h-5" />
                  <span className="2xl:block xl:block lg:block md:block sm:block max-[415px]:hidden">
                    Previous
                  </span>
                </button>
                <div className="flex-1 flex justify-center items-center space-x-1 max-[415px]:flex-none">
                  {/* {generatePageNumbers().map((pageNumber, index) =>
                    pageNumber === "..." ? (
                      <span
                        key={index}
                        className="border px-4 py-2 text-gray-500"
                      >
                        {pageNumber}
                      </span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => table.setPageIndex(pageNumber)}
                        className={`px-4 py-2 text-sm font-normal  ${
                          pageNumber === table.getState().pagination.pageIndex
                            ? "bg-E6EAEB text-22222E"
                            : "text-667085"
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    )
                  )} */}
                  {Array.from(
                          { length: reportData.total_page },
                          (_, index) => index + 1
                        )
                          .filter(
                            (pageNumber) =>
                              // Display only a range of pages(e.g., 2 pages before and 2 pages after the current page)
                              pageNumber >=
                                Math.max(1, reportData.page - 2) &&
                              pageNumber <=
                                Math.min(
                                  reportData.total_page,
                                  reportData.page + 2
                                )
                          )
                          .map((pageNumber) => (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              // ml={2}
                              background={
                                pageNumber === reportData.page
                                  ? "red"
                                  : "gray.300"
                              }
                              color={
                                pageNumber === reportData.page
                                  ? "white"
                                  : "black"
                              }
                              className={`pageNumber rounded px-4 py-2 text-sm font-normal ${pageNumber == reportData.page
                            ? "bg-E6EAEB text-22222E"
                            : "text-667085"}`}
                            >
                              {pageNumber}
                            </button>
                          ))}
                </div>
                <button
                  // onClick={() =>
                  //   table.setPageIndex(
                  //     table.getState().pagination.pageIndex + 1
                  //   )
                  // }
                  onClick={() =>
                    handlePageChange(reportData.page + 1)
                  }
                  // disabled={!table.getCanNextPage()}
                  disabled={
                    reportData.page === reportData.total_page
                  }
                  className={`border border-D0D5DD font-semibold px-4 py-2 flex text-344054 text-sm gap-2 ${reportData.page === reportData.total_page ? "cursor-not-allowed bg-[#cbd5e0]" : "cursor-pointer"}`}
                >
                  <span className="max-[415px]:hidden">
                    Next
                  </span>
                  <ArrowRight className="text-344054 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <ConfirmatioModal
            report_id={selectedReport_id}
            ondailyReportDelete={handleDailyReportFinalDelete}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default DailyReportTable;
