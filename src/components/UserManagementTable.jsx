"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Eye,
} from "feather-icons-react";
import ConfirmatioModal from "./ConfirmationBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import Link from "next/link";
import UserModal from "./UserModel";
import EditLoader from "./EditLoader";
import { Mail, Globe } from "feather-icons-react";
import { useFormik } from "formik";
import {
  defaultValue,
  validationSchema,
} from "@/validation/userEditModelValidation";
import useAuthStore from "@/store/AuthStore";

const UserManagementTable = () => {
  const { storedRole } = useAuthStore();
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [userData, setUserData] = useState([]);
  const [intialData, setInitialData] = useState([]);
  const [intialDataLoading, setInitialDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dataProperty, setDataProperty] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, selectedEdit] = useState("");
  const dropdownPropertyRef = useRef(null);
  const compareEditdata = useRef([]);
  const editedUpdatedData = useRef([]);
  const userEditId = useRef([]);
  const setError = useRef(false);
  const fetchUserList = useRef(false);
  const fetchPropertyList = useRef(false);
//   api for fetching user list
const fetchData = async () => {
    setInitialDataLoading(true);
    // setError(null);
    try {
      const response = await fetch("/api/user-listing", {
        method: "GET",
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const records = await response.json();
      // console.log(records);

      setUserData(records);
      setInitialData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError.current = "true";
      // setError('Error while fetching data. Please try again later.');
    } finally {
      setInitialDataLoading(false);
    }
  };

  useEffect(() => {
    if (fetchUserList.current) return;
        fetchUserList.current = true;
    fetchData();
  }, []);
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);
  // api call for propertydata
  const getProperty = async () => {
    try {
      const response = await fetch(`/api/get-all-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log('response',response);
      // if (!response.ok) {
      //     throw new Error('Failed to get property');
      // }
      const data = await response.json();
      // console.log('response data:', data.data);
      setDataProperty(data.data);
    } catch (err) {
      console.error("Error get all property:", err);
    }
  };
  useEffect(() => {
    if (fetchPropertyList.current) return;
        fetchPropertyList.current = true;
        getProperty();
  }, []);
  const columns = [
    {
      accessorKey: "userFullName",
      header: "Name",
      cell: (props) => {
        // console.log(props);

        return props.getValue() || "NA";
      },
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "EMAIL ADDRESS",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: "MOBILE NUMBER",
      cell: (props) => <p>{props.getValue() || "NA"}</p>,
      enableSorting: false,
    },
    {
      accessorKey: "role",
      header: "ROLE",
      cell: (props) => {
        const roleValue = props.getValue();
        switch (true) {
          case roleValue == "Property Manager":
            return (
              <p className="text-026AA2 bg-F0F9FF w-max px-2.5 py-0.5 rounded-2xl ">
                {roleValue}
              </p>
            );
          case roleValue == "Regional Manager":
            return (
              <p className="text-C01048 bg-FFF1F3 w-max px-2.5 py-0.5 rounded-2xl ">
                {roleValue}
              </p>
            );
          case roleValue == "Asset Manager":
            return (
              <p className="text-5925DC bg-F4F3FF w-max px-2.5 py-0.5 rounded-2xl ">
                {roleValue}
              </p>
            );
          case roleValue == "Investor":
            return (
              <p className="text-027A48 bg-ECFDF3 w-max px-2.5 py-0.5 rounded-2xl ">
                {roleValue}
              </p>
            );
          case roleValue == "Admin":
            return (
              <p className="text-[#c59a00] bg-[#f5eeda] w-max px-2.5 py-0.5 rounded-2xl ">
                {roleValue}
              </p>
            );
          default:
            return "text-black bg-white";
        }
      },
      enableSorting: false,
    },
    storedRole == "Admin" && {
      accessorKey: "actions",
      header: "Actions",
      cell: (props) => {
        const rowId = props.row.original.id;

        const handleClick = async () => {
          selectedEdit("delete");
          userEditId.current = rowId;
          setIsModalOpen(true);
        };
        // console.log(rowId);
        // console.log("row.original.id", props.row.original.id);
        const handleAllDelete = () => {
          setIsModalOpen(true);
          setselectedReport_id(rowId);
        };
        return (
          <div className="flex">
            <Edit2
              onClick={() => {
                handleUserEditModel(rowId);
              }}
              className="w-4 h-4 mr-2.5"
            />
            <Trash2
              onClick={() => {
                handleClick();
              }}
              className="w-4 h-4 "
            />
          </div>
        );
      },
      enableSorting: false,
    },
  ].filter(Boolean);
  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(compareEditdata);
      const storedComapredata = compareEditdata.current;
      const userId = compareEditdata.current.id;

      const editedFields = Object.keys(values).filter(
        (key) => values[key] !== storedComapredata[key]
      );
      const updated_item = {};
      editedFields.forEach((field) => {
        updated_item[field] = values[field];
      });
      // setIsModalOpen(true);
      // selectedEdit("edit")
      // console.log(updated_item);
      editedUpdatedData.current = updated_item;
      userEditId.current = userId;
      if (updated_item && Object.keys(updated_item).length > 0) {
        setIsModalOpen(true);
        selectedEdit("edit");
      } else {
        setIsModalOpen(true);
        selectedEdit("empty");
      }
    },
  });

  // multi select property code start
  const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCheckboxChange = (option) => {
    const value = formik.values.propertyAccess || [];
    if (value.includes(option)) {
      formik.setFieldValue(
        "propertyAccess",
        value.filter((o) => o !== option)
      );
    } else {
      formik.setFieldValue("propertyAccess", [...value, option]);
    }
  };
  const handleClickOutside = (event) => {
    if (
      dropdownPropertyRef.current &&
      !dropdownPropertyRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // multi select property code start
  // handle user delete model code start

  const handleDelete = async (user_id) => {
    try {
      const response = await fetch(`/api/user-property-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.status == 200) {
        setIsModalOpen(false);
        fetchData();
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      // alert("error while deleting record");
    }
  };
  // handle user delete model code ends

  // handle user edit model code start
  const handleUserEditModel = async (user_id) => {
    // alert(user_id)
    if (user_id) {
      setIsLoading(true);
      setShowModal(true);

      try {
        const response = await fetch(
          `/api/user-read-property/?user_id=${user_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ user_id: user_id }),
          }
        );
        // console.log("response", response);

        const data = await response.json();
        console.log("response data:", data);

        const editData = data.data;

        if (editData) {
          // console.log("editData", editData);
          // setShowModal(true);
          // setApiSingleData(editData);
          compareEditdata.current = editData;

          // setSelectedIds(editData.propertyAccess);
          // formik.setFieldValue("username", editData.username);
          formik.setFieldValue("userFullName", editData.userFullName);
          formik.setFieldValue("email", editData.email);
          formik.setFieldValue("phoneNumber", editData.phoneNumber);
          formik.setFieldValue("role", editData.role);
          formik.setFieldValue("propertyAccess", editData.propertyAccess);
          // setPmid(editData.id);
        }

        // Assuming you need to show a message based on the response
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };
  const handleUserFinalEdit = async (user_id, editedUpdatedData) => {
    // console.log("userData",user_id ,editedUpdatedData)
    const userResponse = await fetch(
      `/api/user-edit-property/?user_id=${user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          updated_item: editedUpdatedData,
        }),
      }
    );
    if (userResponse.status == 200) {
      // alert("inside if cndition")
      setIsModalOpen(false);
      setShowModal(false);
      toast.success("User updated successfully!");
      fetchData();
      // actionRef.current = "clicked";
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    }
  };
  // handle user edit model code end
  const table = useReactTable({
    columns,
    data: userData || [],
    state: {
      pagination, // Ensure this is your pagination state
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
  });
  const totalPages = Math.ceil(userData.length / pagination.pageSize);
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
  // Toggle refreshData to re-fetch data

  // Handle search input change
  const handleSearchChange = (e) => {
    // Get the search value from the input
    const searchValue = e.target.value;

    setSearchTerm(searchValue);

    // If the search value is empty, reset the user data to the initial data
    if (searchValue === "") {
        setError.current = "false";
      setUserData(intialData);
    } else {
      // Otherwise, filter the initial data based on the search value
      const filteredData = intialData.filter(
        (user) =>
          user.userFullName &&
          user.userFullName.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (filteredData.length == 0) {
        setError.current = "true";
      }else{
        // Update the user data with the filtered data
        setError.current = "false";
        setUserData(filteredData);
      }
    }
  };

  // Create a composite key for re-rendering
  // const compositeKey = `${searchTerm}-${refreshData}`;
  return (
    <>
      <div className="p-4 flex justify-between flex-wrap items-center max-[768px]:flex-col">
        <div className="2xl:w-4/12 xl:w-4/12 lg:w-4/12 md:w-auto mb-2 md:mb-0">
          <h3 className="text-lg font-normal text-101828">Users</h3>
        </div>
        <div className="2xl:w-8/12 xl:w-8/12 lg:w-8/12 md:w-auto max-[768px]:w-full max-[768px]:justify-center flex flex-wrap justify-start md:justify-end">
          <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              className="pl-11 pr-4 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full md:w-72 text-sm font-normal text-101828 placeholder:text-7F7F86 focus:outline-none"
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
          <UserModal btn_title="Add New User" dataProperty={dataProperty} listingFunction={fetchData} />
        </div>
      </div>
      {intialDataLoading ? (
        <Loading />
      ) : setError.current == "true" ? (
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
                              <ChevronUp className="" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="" />
                            ) : (
                              <ChevronUp className="" />
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
                  <span key={index} className="border px-4 py-2 text-gray-500">
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
      )}
      <ConfirmatioModal
        username={userEditId.current}
        updated_item={editedUpdatedData.current}
        userEditfinal={handleUserFinalEdit}
        onDelete={handleDelete}
        userEdit={edit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* edit model code start */}
      {showModal ? (
        <div className="fixed inset-0 z-50 flex  overflow-x-hidden overflow-y-auto justify-center backdrop-blur bg-gray-600 bg-opacity-50">
          <div
            className={`relative w-auto  h-auto m-auto max-w-3xl ${
              showModal ? "scale-100 animate-fadeIn" : "scale-0"
            }`}
          >
            <div className="w-[780px] border border-border-A4A4A9 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
              {isLoading ? (
                <EditLoader /> // Show loader when loading
              ) : (
                <>
                  <div className="flex items-start justify-between pt-6 pr-6 pl-6 pb-0 rounded-t">
                    <div className="modelHeading">
                      <h3 className="font-bold text-15151C text-lg">
                        Edit User
                      </h3>
                      <div className="contentModelHeading text-344054 text-sm">
                        Your overview hub for seamless management.
                      </div>
                    </div>
                    <button
                      className="bg-gray-300 p-1 rounded-full border-0 float-right"
                      onClick={() => setShowModal(false)}
                    >
                      <img src="/x.svg" alt="close Icon" />
                    </button>
                  </div>
                  <div className="relative p-[32px] flex-auto">
                    <form
                      className="rounded w-full"
                      onSubmit={formik.handleSubmit}
                    >
                      <div className="mailNofields flex flex-row">
                        <label className="block w-[100%] ">
                          <span className="block text-sm font-medium text-slate-700">
                            Name
                          </span>
                          <input
                            type="text"
                            name="userFullName"
                            id="userFullName"
                            value={formik.values.userFullName}
                            onChange={formik.handleChange}
                            className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                            placeholder="Enter your Name"
                          />
                          {formik.touched.userFullName &&
                            formik.errors.userFullName && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.userFullName}
                              </div>
                            )}
                        </label>
                      </div>
                      <div className="mailNofields flex flex-row mt-[20px]">
                        <label className="block w-[50%] mr-[20px]">
                          <span className="block text-sm font-medium text-slate-700">
                            Email Address (Username)
                          </span>
                          <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              className="pl-10 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="you@example.com"
                            />
                          </div>
                          {formik.touched.email && formik.errors.email && (
                            <div className="error text-red text-sm font-normal mt-1.5">
                              {formik.errors.email}
                            </div>
                          )}
                        </label>
                        <label className="block w-[50%]">
                          <span className="block text-sm font-medium text-slate-700">
                            Mobile Number
                          </span>
                          <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="string"
                              name="phoneNumber"
                              id="phoneNumber"
                              value={formik.values.phoneNumber}
                              onChange={formik.handleChange}
                              className="pl-10 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                              placeholder="enter your phone number"
                            />
                          </div>
                          {formik.touched.phoneNumber &&
                            formik.errors.phoneNumber && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.phoneNumber}
                              </div>
                            )}
                        </label>
                      </div>

                      <div className="mailNofields flex flex-row">
                        <div className="selectDiv w-full mr-[20px] flex flex-col mt-5">
                          <label
                            htmlFor="property"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Role
                          </label>
                          <div className="relative mt-2">
                            <select
                              id="role"
                              name="role"
                              value={formik.values.role}
                              onChange={formik.handleChange}
                              className="appearance-none w-full px-3.5 py-2 bg-white border text-base focus:outline-none focus:ring-2  overflow-auto"
                              size="1"
                            >
                              <option selected>select Role</option>
                              <option
                                value="Regional Manager"
                                selected={
                                  formik.values.role == "Regional Manager"
                                }
                              >
                                Regional manager
                              </option>
                              <option value="Property Manager">
                                Property Manager
                              </option>
                              <option value="Asset Manager">
                                Asset Manager
                              </option>
                              <option value="Investor">Investor</option>
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
                          {formik.touched.role && formik.errors.role && (
                            <div className="error text-red text-sm font-normal mt-1.5">
                              {formik.errors.role}
                            </div>
                          )}
                        </div>

                        <div className="flex mt-5 justify-center flex-col w-full">
                          <label
                            htmlFor="property"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Select Property
                          </label>
                          {/* <div className="relative mt-2"> */}
                          {/* multi select edit user start */}
                          <div
                            className="relative inline-block mt-2 text-left"
                            ref={dropdownPropertyRef}
                          >
                            <div>
                              <button
                                type="button"
                                id="dropdownToggle"
                                onClick={handleToggleClick}
                                className={`inline-flex ${
                                  formik.values.propertyAccess.length == 0
                                    ? "text-slate-400"
                                    : "text-black"
                                } justify-between w-full py-2.5 border border-gray-300 shadow-sm px-4 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:border-black focus:border-[3px] focus:rounded-md focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}
                              >
                                {formik.values.propertyAccess.length == 0
                                  ? "Select Properties"
                                  : formik.values.propertyAccess.length +
                                    " Properties Selected"}
                                <span className="">&#9662;</span>
                              </button>
                            </div>

                            {isDropdownOpen && (
                              <div
                                id="dropdownMenu"
                                className="origin-top-right absolute mt-2 w-full h-36 overflow-y-scroll rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                              >
                                <div className="py-1">
                                  {dataProperty &&
                                    Array.isArray(dataProperty) &&
                                    dataProperty.length > 0 &&
                                    dataProperty.map((option) => (
                                      <div
                                        key={option.property_id}
                                        className="flex items-center px-4 py-2"
                                      >
                                        <input
                                          type="checkbox"
                                          id={option.property_id}
                                          checked={
                                            formik.values.propertyAccess &&
                                            formik.values.propertyAccess.includes(
                                              option.property_id
                                            )
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              option.property_id
                                            )
                                          }
                                          className={`mr-2 h-4 w-4 border-gray-300 rounded focus:ring-indigo-500 hover:cursor-pointer ${
                                            formik.values.propertyAccess.includes(
                                              option.property_id
                                            )
                                              ? "accent-8e9397"
                                              : ""
                                          }`}
                                        />
                                        <label
                                          htmlFor={option.property_id}
                                          className="text-sm text-gray-700 hover:cursor-pointer"
                                        >
                                          {option.property_name}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                            {/* multi select edit user end */}
                          </div>
                          {formik.touched.propertyAccess &&
                            formik.errors.propertyAccess && (
                              <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.propertyAccess}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end pt-7  rounded-b">
                        <button
                          className="w-full font-bold text-15151C py-[12px] px-[20px] mr-[8px] border-2 border-black"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="w-full font-bold text-white bg-black py-[12px] px-[20px] border-2 border-black"
                          type="submit"
                          // onClick={()=>setShowModal(false)}
                        >
                          Edit User
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {/* edit model code end */}
    </>
  );
};

export default UserManagementTable;
