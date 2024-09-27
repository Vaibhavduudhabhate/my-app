"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Globe,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Minus
} from "feather-icons-react";
import ConfirmatioModal from "./ConfirmationBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import Link from "next/link";
import EditLoader from "./EditLoader";
import { useFormik } from "formik";
import {
  propertyDefaultValue,
  propertyValidationSchema,
} from "@/validation/propertyModel";
import PropertyModel from "./PropertyModel";

const PropertyManagementtable = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [isOpen, setIsOpen] = useState(false);
  const [propertyModel, setProprtyModel] = useState(false);
  const verticalDropDown = useRef(null);
  const isLoading = useRef(false);
  const [intialDataLoading, setInitialDataLoading] = useState(false);
  const setError = useRef(false);
  const stateSelectRef = useRef();
  const intialDataRef = useRef([]);
  const [statelist, setStatelist] = useState();
  const compareEditdata = useRef([]);
  const [searchTerm, setSearchTerm] = useState("");
  const editedUpdatedData = useRef([]);
  const PropertyEditId = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, selectedEdit] = useState("");
  const fetchStateList = useRef(false);
  const fetchPropertyList = useRef(false);
  //   useEffect when click outside found dropdown will close code start
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        verticalDropDown.current &&
        !verticalDropDown.current.contains(event.target)
      ) {
        setIsOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [verticalDropDown]);
  //   select2 useEffect
  useEffect(() => {
    const loadSelect2 = async () => {
      if (
        stateSelectRef.current
        // && citySelectRef.current
      ) {
        // Dynamically import Select2
        await import("select2");

        const $stateSelect = $(stateSelectRef.current);

        $stateSelect.select2({
          placeholder: "Select a State",
          width: "100%",
        });

        $stateSelect.on("change", function (e) {
          const selectedStates = e.target.value;
          // console.log(selectedStates);
          formik.setFieldValue("state", selectedStates);
        });

        // Clean up on component unmount
        return () => {
          $stateSelect.select2("destroy");
          //   $citySelect.select2("destroy");
        };
      }
    };

    loadSelect2();
  });
  // property listing api call
  const fetchData = async () => {
    try {
      setInitialDataLoading(true);
      const response = await fetch("/api/property-listing", {
        method: "GET",
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      // console.log("records", records); // For debugging
      setPropertyData(records);
      intialDataRef.current = records;
    } catch (error) {
      console.error("Error fetching data:", error);
      setError.current = "true";
    }finally{
      setInitialDataLoading(false);
    }
  };
  useEffect(() => {
    if (fetchPropertyList.current) return;
    fetchPropertyList.current = true;
    fetchData();
    
  }, []);
  // useEffect to call state list
  useEffect(()=>{
    if (fetchStateList.current) return;
    fetchStateList.current = true;
    fetchStateData();
  })
  const fetchStateData = async () => {
    try {
      const response = await fetch(
        "/api/state-listing",
        { method: "GET" },
        { cache: "no-cache" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      // setUserData(records);
      // console.log(records);
      setStatelist(records);
    } catch (error) {
      console.error("Error fetching state data:", error);
    }
  };
  // action column dropdown open and close code start
  const toggleDropdown = (id) => {
    // alert()
    setIsOpen(isOpen === id ? null : id);
  };
  // action column dropdown open and close code end
  //   property model formik code start
  const formik = useFormik({
    initialValues: propertyDefaultValue,
    validationSchema: propertyValidationSchema,
    onSubmit: async (values) => {
      //   console.log(values);
      const storedComapredata = compareEditdata.current;
      const propertyId = compareEditdata.current.property_id;
      const editedFields = Object.keys(values).filter(
        (key) => values[key] !== storedComapredata[key]
      );
      const updated_item = {};
      editedFields.forEach((field) => {
        updated_item[field] = values[field];
      });
      console.log(updated_item);
      editedUpdatedData.current = updated_item;
      PropertyEditId.current = propertyId;
      if (updated_item && Object.keys(updated_item).length > 0) {
        setIsModalOpen(true);
        selectedEdit("propEdit");
      } else {
        setIsModalOpen(true);
        selectedEdit("empty");
      }
    },
  });
  const handlePropertyEditFinalClick = async (propertyId, updated_item) => {
    const propertyResponse = await fetch(
      `/api/property-management-update/?property_id=${propertyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: propertyId,
          updated_item: updated_item,
        }),
      }
    );
    if (propertyResponse.status == 200) {
      setIsModalOpen(false);
      setProprtyModel(false);
      toast.success("Property updated successfully!");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
      fetchData();
    }
  };
  const handlePropertyDelete = async (property_id) => {
    
    // console.log(property_id);
    setIsModalOpen(true);
    try {
      const response = await fetch(`/api/delete-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property_id: property_id }),
      });

      if (response.status == 200) {
        setIsModalOpen(false);
        toast.success("Property deleted successfully!");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
        fetchData();
      }
      // setGetData(
      //   getData.filter((property) => property.property_id !== property_id)
      // );
    } catch (error) {
      // alert('Error deleting property');
    }
  };
  // table columns with header
  const columns = [
    {
      accessorKey: "property_name",
      header: "Property Name",
      cell: (props) => {
        // console.log(props);
        return props.getValue() || "NA";
      },
      enableSorting: true,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (props) => {
        return props.getValue() || "NA";
      },
    },
    {
      accessorKey: "location",
      header: "STREET ADDRESS",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: false,
    },
    {
      accessorKey: "total_units",
      header: "TOTAL UNIT",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "DESCRIPTION",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (props) => {
        const propertyId = props.row.original.property_id;
        const handlePropertyRead = async () => {
          isLoading.current = "true";
          setProprtyModel(true);
          try {
            const response = await fetch(
              `/api/property-management-edit/?property_id=${propertyId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({ property_id: propertyId }),
              }
            );
            // console.log('response',response);
            const data = await response.json();
            // console.log('response data:', data);

            const editPropertyData = data.data;
            // console.log("editPropertyData", editPropertyData);
            if (editPropertyData) {
              isLoading.current = "false";
              compareEditdata.current = editPropertyData;
              formik.setFieldValue(
                "property_name",
                editPropertyData.property_name
              );
              formik.setFieldValue("postalCode", editPropertyData.postalCode);
              if (editPropertyData.state) {
                formik.setFieldValue("state", editPropertyData.state);
                // fetchCityData(editPropertyData.state);
              }
              formik.setFieldValue("city", editPropertyData.city);
              formik.setFieldValue("location", editPropertyData.location);
              formik.setFieldValue("total_units", editPropertyData.total_units);
              formik.setFieldValue(
                "propertyMobileNumber",
                editPropertyData.propertyMobileNumber
              );
              formik.setFieldValue(
                "propertyEmail",
                editPropertyData.propertyEmail
              );
              formik.setFieldValue(
                "propertyWebsite",
                editPropertyData.propertyWebsite
              );
              formik.setFieldValue("description", editPropertyData.description);
              // setShowProertyEditModal(true);
              //   setPmid(editPropertyData.property_id);
              //   setApiSingleData(editPropertyData);
            }
          } catch (error) {
            console.error("An error occurred:", error);
          } finally {
            console.log(isLoading);

            isLoading.current = "false"; // Hide loader
          }
        };
        const handlePropertyClick = async () => {
          // console.log()
          selectedEdit("delete");
          PropertyEditId.current = propertyId;
          setIsModalOpen(true);
        };
        return (
          <div className="flex">
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
                  <a
                    onClick={() => handlePropertyRead()}
                    // href="javascript:void(0)"
                    className="text-gray-700 cursor-pointer block px-4 py-2 text-sm hover:bg-gray-300 hover:text-blue-800"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    Edit
                  </a>

                  <a
                    // href="javascript:void(0)"
                    className="text-gray-700 cursor-pointer block px-4 py-2 text-sm hover:bg-gray-300 hover:text-blue-800"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                    onClick={() => handlePropertyClick()}
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
  //   tanstack table code start
  const table = useReactTable({
    columns,
    data: propertyData || [],
    state: {
      pagination, // Ensure this is your pagination state
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
  });
  //   pagination code start
  const totalPages = Math.ceil(propertyData.length / pagination.pageSize);
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
  //   search filled code start
  const handleSearchChange = (e) => {
    // Get the search value from the input
    const searchValue = e.target.value;

    setSearchTerm(searchValue);

    // If the search value is empty, reset the user data to the initial data
    if (searchValue == "") {
        setError.current = "false";
      setPropertyData(intialDataRef.current);
    } else {
      // Otherwise, filter the initial data based on the search value
      const filteredData =
        intialDataRef &&
        intialDataRef.current.filter(
          (property) =>
            property.property_name
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            property.city.toLowerCase().includes(searchValue.toLowerCase()) ||
            property.location.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(filteredData);
        
        if (filteredData.length == 0) {
            setError.current = "true";
          }else{
            // Update the user data with the filtered data
            setError.current = "false";
            setPropertyData(filteredData);
          }
    //   setPropertyData(filteredData);
    }
  };
  return (
    <>
      <div className="p-4 flex justify-between flex-wrap items-center max-[788px]:justify-center max-[788px]:flex-col">
        <div className="w-auto 2xl:w-4/12 xl:w-4/12 lg:w-4/12 md:w-auto mb-2 md:mb-0">
          <h3 className="text-lg font-normal text-101828">Properties</h3>
        </div>
        <div className="max-[768px]:w-full max-[768px]:justify-center 2xl:w-8/12 xl:w-8/12 lg:w-8/12 md:w-auto flex flex-wrap justify-start md:justify-end">
          <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by Property name, city and street address"
              className="pl-11 pr-4 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full md:w-[25rem] text-sm font-normal text-101828 placeholder:text-7F7F86 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 pointer-events-none">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 16L12.875 12.375M14.8333 7.66667C14.8333 11.3486 11.8486 14.3333 8.16667 14.3333C4.48477 14.3333 1.5 11.3486 1.5 7.66667C1.5 3.98477 4.48477 1 8.16667 1C11.8486 1 14.8333 3.98477 14.8333 7.66667Z"
                  stroke="#22222E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <PropertyModel btn_title="Add New Property" statelist={statelist} propertyListingFun={fetchData} />
        </div>
      </div>
      {
        (intialDataLoading ? (<Loading />) : setError.current == "true" || propertyData.length == 0 ? (
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
          <div className="p-4">
            <div className="outer-table-div overflow-x-auto">
              <table className="min-w-full divide-y divide-D0D5DD divide-dashed">
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
            {/* {showpaginationButtons != undefined && ( */}
            <div className="flex justify-between items-center mt-4 py-3 max-[415px]:justify-center max-[415px]:gap-[5px]">
              <button
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex - 1)
                }
                disabled={!table.getCanPreviousPage()}
                className="border border-D0D5DD font-semibold px-3.5 py-2 flex text-344054 text-sm gap-2"
              >
                <ArrowLeft className="text-344054 w-5 h-5" />
                <span className="2xl:block xl:block lg:block md:block sm:block max-[415px]:hidden">
                    Previous
                  </span>
              </button>
              <div className="flex-1 flex justify-center items-center space-x-1 max-[415px]:flex-none">
                {generatePageNumbers().map((pageNumber, index) =>
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
                )}
              </div>
              <button
                onClick={() =>
                  table.setPageIndex(table.getState().pagination.pageIndex + 1)
                }
                disabled={!table.getCanNextPage()}
                className={`border border-D0D5DD font-semibold px-4 py-2 flex text-344054 text-sm gap-2`}
              >
                <span className="max-[415px]:hidden">
                    Next
                  </span>
                <ArrowRight className="text-344054 w-5 h-5" />
              </button>
            </div>
            {/* )} */}
          </div>
        ))
      }
      <ConfirmatioModal
        property_id={PropertyEditId.current}
        onPropertydelete={handlePropertyDelete}
        onPropertyEdit={handlePropertyEditFinalClick}
        updated_item={editedUpdatedData.current}
        userEdit={edit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Property Edit model start */}
      {propertyModel ? (
        <div className="flex justify-center backdrop-blur overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          {/* <div className={`relative w-auto my-6 mx-auto max-w-3xl`}> */}
          <div
            className={`relative w-auto my-6 mx-auto max-w-3xl ${
              propertyModel ? "scale-100 animate-fadeIn" : "scale-0"
            }`}
          >
            <div className="w-full lg:w-[780px] sm:w-full  border border-border-A4A4A9 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
              {isLoading.current == "true" ? (
                <EditLoader /> // Show loader when loading
              ) : (
                <>
                  <div className="flex items-start justify-between pt-6 pr-6 pl-6 pb-0 rounded-t ">
                    <div className="modelHeading">
                      <h3 className="font-bold text-15151C text-lg w-full h-7">
                        Add New Property
                      </h3>
                      <div className="contentModelHeading text-344054 text-sm w-full h-5">
                        Enter details to showcase your latest investment or
                        listing
                      </div>
                    </div>

                    <button
                      className="bg-gray-300 p-1 rounded-full border-0  float-right"
                      onClick={() => setProprtyModel(false)}
                    >
                      <img src="/x.svg" alt="close Icon" srcSet="" />
                    </button>
                  </div>

                  <form onSubmit={formik.handleSubmit}>
                    <div className="relative p-[32px] flex-auto">
                      <div className="rounded  w-full">
                        <div className="mailNofields flex flex-row items-start">
                          <label className="block w-[50%] mr-[20px]">
                            <span className=" block text-sm font-medium text-slate-700">
                              Property Name
                            </span>
                            <input
                              type="text"
                              name="property_name"
                              value={formik.values.property_name}
                              onChange={formik.handleChange}
                              className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="Enter Your Property Name"
                            />
                            {formik.touched.property_name &&
                              formik.errors.property_name && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.property_name}
                                </div>
                              )}
                          </label>
                          <label className="block w-[50%]">
                            <span className=" block text-sm font-medium text-slate-700">
                              Enter Postal Code
                            </span>
                            <input
                              type="text"
                              name="postalCode"
                              value={formik.values.postalCode}
                              onChange={formik.handleChange}
                              className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="Enter your postal code"
                            />
                            {formik.touched.postalCode &&
                              formik.errors.postalCode && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.postalCode}
                                </div>
                              )}
                          </label>
                        </div>
                        <div className="RoleSelectFields flex flex-row mt-[20px]">
                          <div className="selectDiv w-[50%] mr-[20px] flex flex-col items-start">
                            <label
                              htmlFor="countries"
                              className="block text-sm font-medium text-gray-900"
                            >
                              State
                            </label>
                            <div className="relative mt-2 w-full">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="w-5 h-5 text-gray-400" />
                              </div>
                              <select
                                id="state"
                                ref={stateSelectRef}
                                name="state"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                className="appearance-none pl-10 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              >
                                <option
                                  value=""
                                  hidden
                                  disabled
                                  placeholder="Select State"
                                >
                                  Select State
                                </option>
                                {statelist &&
                                  Array.isArray(statelist) &&
                                  statelist.length > 0 &&
                                  statelist.map((states, index) => (
                                    // console.log(states, index)
                                    <option key={index} value={states}>
                                      {states}
                                    </option>
                                  ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg
                                  className="w-4 h-4 text-gray-400"
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
                            {formik.touched.state && formik.errors.state && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.state}
                              </div>
                            )}
                          </div>
                          {/* <div className="selectDiv w-[50%] flex flex-col">
                                                        <label
                                                            htmlFor="countries"
                                                            className="block text-sm font-medium text-gray-900"
                                                        >
                                                            City
                                                        </label> */}
                          {/* <div className="relative mt-2">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Globe className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                            <select
                                                                id="city"
                                                                name="city"
                                                                ref={
                                                                    citySelectRef
                                                                }
                                                                value={
                                                                    formik
                                                                        .values
                                                                        .city
                                                                }
                                                                onChange={
                                                                    formik.handleChange
                                                                }
                                                                className="appearance-none pl-10 w-full px-[14px] py-[10px] bg-white border border-slate-300 shadow-sm placeholder-slate-400 sm:text-sm"
                                                            >
                                                                <option
                                                                    value=""
                                                                    hidden
                                                                    disabled
                                                                    placeholder="Select City"
                                                                >
                                                                    Select City
                                                                </option>
                                                                {citylist &&
                                                                    Array.isArray(
                                                                        citylist
                                                                    ) &&
                                                                    citylist.length >
                                                                    0 &&
                                                                    citylist.map(
                                                                        (
                                                                            cities,
                                                                            index
                                                                        ) => (
                                                                            // console.log(states, index)
                                                                            <option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    cities
                                                                                }
                                                                            >
                                                                                {
                                                                                    cities
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </select>
                                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                                <svg
                                                                    className="w-4 h-4 text-gray-400"
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
                                                        {formik.touched.city &&
                                                            formik.errors
                                                                .city && (
                                                                <div className="error text-red text-sm font-normal mt-1.5">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .city
                                                                    }
                                                                </div>
                                                            )} */}
                          {/* </div> */}
                          <label className="block w-[50%]">
                            <span className="block text-sm font-medium text-slate-700">
                              City
                            </span>
                            <div className="relative mt-2">
                              {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div> */}
                              <input
                                type="text"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                className="mt-[5px] px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                                placeholder="Enter city"
                              />
                            </div>
                            {formik.touched.city && formik.errors.city && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.city}
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="mailNofields flex flex-row mt-[20px]">
                          <label className="block w-[50%] mr-[20px]">
                            <span className="block text-sm font-medium text-slate-700">
                              Location
                            </span>
                            <div className="relative mt-2">
                              <input
                                type="text"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                className=" px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                                placeholder="Enter Location"
                              />
                            </div>
                            {formik.touched.location &&
                              formik.errors.location && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.location}
                                </div>
                              )}
                          </label>
                          <label className="block w-[50%]">
                            <span className=" block text-sm font-medium text-slate-700">
                              Total Unit
                            </span>
                            <div className="relative mt-2">
                              <input
                                type="string"
                                name="total_units"
                                value={formik.values.total_units}
                                onChange={formik.handleChange}
                                className=" px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                                placeholder="Enter Total Unit"
                              />
                            </div>
                            {formik.touched.total_units &&
                              formik.errors.total_units && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.total_units}
                                </div>
                              )}
                          </label>
                        </div>
                        <div className="mailNofields flex flex-row mt-[20px]">
                          <label className="block w-[50%] mr-[20px]">
                            <span className=" block text-sm font-medium text-slate-700">
                              Property Contact Number
                            </span>

                            <input
                              type="string"
                              name="propertyMobileNumber"
                              value={formik.values.propertyMobileNumber}
                              onChange={formik.handleChange}
                              className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="enter your phone number"
                            />
                            {formik.touched.propertyMobileNumber &&
                              formik.errors.propertyMobileNumber && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.propertyMobileNumber}
                                </div>
                              )}
                          </label>
                          <label className="block w-[50%] ">
                            <span className="block text-sm font-medium text-slate-700">
                              Property Email
                            </span>
                            <input
                              type="email"
                              name="propertyEmail"
                              value={formik.values.propertyEmail}
                              onChange={formik.handleChange}
                              className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="you@example.com"
                            />
                            {formik.touched.propertyEmail &&
                              formik.errors.propertyEmail && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                  {formik.errors.propertyEmail}
                                </div>
                              )}
                          </label>
                        </div>
                        <label className="block w-full mt-[20px]">
                          <span className="block text-sm font-medium text-slate-700">
                            Property Website
                          </span>
                          <input
                            type="url"
                            name="propertyWebsite"
                            value={formik.values.propertyWebsite}
                            onChange={formik.handleChange}
                            className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                            placeholder="https://example.com"
                          />
                          {formik.touched.propertyWebsite &&
                            formik.errors.propertyWebsite && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.propertyWebsite}
                              </div>
                            )}
                        </label>
                        <label className="block w-full mt-[20px]">
                          <span className="block text-sm font-medium text-slate-700">
                            Property Description
                          </span>
                          <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                            placeholder="Enter a description of the property"
                          ></textarea>
                          {formik.touched.description &&
                            formik.errors.description && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.description}
                              </div>
                            )}
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end pt-0 pr-7 pl-7 pb-7 rounded-b">
                      <button
                        className="w-full font-bold text-15151C py-[12px] px-[20px] mr-[8px] border-2 border-black"
                        type="button"
                        onClick={() => setProprtyModel(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="w-full font-bold bg-black text-white  py-[12px] px-[20px] mr-[8px] border-2 border-black"
                        type="submit"
                      >
                        Update Property
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PropertyManagementtable;
