"use client";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Mail, Globe } from "feather-icons-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "feather-icons-react";
import Link from "next/link";
import ConfirmatioModal from "./ConfirmationBox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import {
  propertyDefaultValue,
  propertyValidationSchema,
} from "@/validation/propertyModel";
import {
  defaultValue,
  validationSchema,
} from "@/validation/userEditModelValidation";
import EditLoader from "./EditLoader";

// Define columns
const columnHelper = createColumnHelper();

// Accept data as props
const Table = ({
  data,
  showPaginationButton,
  maximumDisplayData,
  columnsConfig,
  displayLinkWithIcon,
  displayVerticalIcon,
  displayTrashandPencilIcon,
  pageName,
  onEditOrDelete,
}) => {
  /*Property edit model start */
  const [showProertyEditModal, setShowProertyEditModal] = useState(false);
  const [pmid, setPmid] = useState();
  /* Property Edit model end */
  /* Edit model start*/
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* Edit model end*/
  const selectRef1 = useRef(null);
  /* Edit delete dropdoen start*/
  const [isOpen, setIsOpen] = useState(false);
  /* Edit delete dropdoen end */
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [slug, setSlug] = useState("");
  const [getData, setGetData] = useState(data);
  const [selectedId, setSelectedId] = useState();
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUpdatedItem, setSelectedUpdatedItem] = useState("");
  const [edit, selectedEdit] = useState("");
  const actionRef = useRef("");
  const dropdownRef = useRef(null);
  const [selectedProperty_id, setselectedProperty_id] = useState("");
  const [selectedReport_id, setselectedReport_id] = useState("");
  const [apiSingleData, setApiSingleData] = useState();
  const [dataProperty, setDataProperty] = useState();
  const [selectedIds, setSelectedIds] = useState();
  const [statelist, setStatelist] = useState();
  const [citylist, setCitylist] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const stateSelectRef = useRef();
  const citySelectRef = useRef();
  const dropdownPropertyRef = useRef(null);
  const propertySelectRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const trimText = (text, maxLength) => {
    if (typeof text !== "string") {
      text = String(text);
    }
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  // useEFfect for state and city
  useEffect(() => {
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

    fetchStateData();
  }, [showModal]);
  const fetchCityData = async (selectedState) => {
    try {
      const response = await fetch(
        `/api/city-listing/?state_id=${selectedState}`,
        { method: "GET" },
        { cache: "no-cache" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const cityRecords = await response.json();
      // setUserData(records);
      // console.log(cityRecords);
      setCitylist(cityRecords);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };
  useEffect(() => {
    const loadSelect2 = async () => {
      if (
        stateSelectRef.current
        // && citySelectRef.current
      ) {
        // Dynamically import Select2
        await import("select2");

        const $stateSelect = $(stateSelectRef.current);
        const $citySelect = $(citySelectRef.current);

        $stateSelect.select2({
          placeholder: "Select a State",
          width: "100%",
        });
        $citySelect.select2({
          placeholder: "Select a City",
          width: "100%",
        });

        $stateSelect.on("change", function (e) {
          const selectedStates = e.target.value;
          // console.log(selectedStates);
          formik.setFieldValue("state", selectedStates);
          if (selectedStates) {
            fetchCityData(selectedStates);
          }
        });

        $citySelect.on("change", function (e) {
          const selectedCities = e.target.value;
          // console.log(selectedCities);
          formik.setFieldValue("city", selectedCities);
        });

        // Clean up on component unmount
        return () => {
          $stateSelect.select2("destroy");
          $citySelect.select2("destroy");
        };
      }
    };

    loadSelect2();
  });
  // console.log("state variable", getData);
  const handleDropdownToggle = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  useEffect(() => {
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
    getProperty();
  }, []);
  useEffect(() => {
    const loadSelect2 = async () => {
      if (selectRef1.current) {
        // Dynamically import Select2
        await import("select2");
        const $categorySelect = $(selectRef1.current);
        $categorySelect.select2({
          placeholder: "Select a Property",
          width: "100%",
        });
        $categorySelect.on("change", function (e) {
          const selectedCharities = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          // console.log(selectedCharities);
          formik.setFieldValue("propertyAccess", selectedCharities);
        });

        // Clean up on component unmount
        // return () => {
        //   $(selectRef1.current).select2("destroy");
        //   // $(selectRef2.current).select2("destroy");
        // };
      }
    };

    loadSelect2();
  });
  // useEffect(() => {
  //     const handleClickOutside = (event) => {
  //         if (
  //             dropdownRef.current &&
  //             !dropdownRef.current.contains(event.target)
  //         ) {
  //             setOpenDropdownId(null);
  //         }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //         document.removeEventListener("mousedown", handleClickOutside);
  //     };
  // }, []);
  // useEffect(() => {
  //     function handleClickOutside(event) {
  //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //             setIsOpen(false);
  //         }
  //     }

  //     document.addEventListener('mousedown', handleClickOutside);
  //     return () => {
  //         document.removeEventListener('mousedown', handleClickOutside);
  //     };
  // }, []);
  useEffect(() => {
    // Ensure that the window object is available
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const parts = url.split("/dashboard/");
      if (parts.length > 1) {
        setSlug(parts[1]);
      }
    }
  }, []);
  const cities = [
    { name: "Independence Place", value: "Independence Place" },
    { name: "Sandpiper Apartments", value: "Sandpiper Apartments" },
    { name: "210-214 Franklin St.", value: "210-214 Franklin St." },
    { name: "Property3", value: "property3" },
    { name: "Property2", value: "property2" },
    { name: "Property1", value: "property1" },
    // { name: 'Istanbul', code: 'IST' },
    // { name: 'Paris', code: 'PRS' },
  ];
  const handlePropertyClick = async (property_id) => {
    setselectedProperty_id(property_id);
    setIsModalOpen(true);
  };
  const handleDailyReportDelete = async (report_id) => {
    setIsModalOpen(true);
    setselectedReport_id(report_id);
  };
  const handleDailyReportFinalDelete = async (report_id) => {
    console.log(report_id);
    // setIsModalOpen(false);
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
      setGetData(
        getData.filter((property) => property.report_id !== report_id)
      );
    } catch (error) {
      // alert('Error deleting property');
    }
  };
  const handlePropertyDelete = async (property_id) => {
    console.log(property_id);
    // setIsModalOpen(false);
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
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setGetData(
        getData.filter((property) => property.property_id !== property_id)
      );
    } catch (error) {
      // alert('Error deleting property');
    }
  };
  const handleDelete = async (user_id) => {
    // console.log(username);
    try {
      const response = await fetch(`/api/user-property-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.status == 200) {
        // alert("inside if cndition")
        setIsModalOpen(false);
        toast.success("User deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      setGetData(
        getData.filter((property) => property.userFullName !== userFullName)
      );
    } catch (error) {
      // alert("error while deleting record");
    }
  };
  const handleClick = async (username) => {
    // alert(username)
    setSelectedUsername(username);
    setIsModalOpen(true);
  };
  const handleAllDelete = async (id) => {
    // console.log(id);
    if (slug == "property-management") {
      console.log("property page is sucess");
      await handlePropertyClick(id);
    } else {
      console.log(slug, id);
      await handleDailyReportDelete(id);
    }
  };

  /** handle edit click function start***/

  const formik = useFormik({
    initialValues:
      pageName == "property-management"
        ? propertyDefaultValue
        : pageName == "user-management"
        ? defaultValue
        : defaultValue,
    validationSchema:
      pageName == "property-management"
        ? propertyValidationSchema
        : pageName == "user-management"
        ? validationSchema
        : validationSchema,
    onSubmit: async function (values) {
      const editedFields = Object.keys(values).filter(
        (key) => values[key] !== apiSingleData[key]
      );
      const updated_item = {};
      editedFields.forEach((field) => {
        updated_item[field] = values[field];
      });
      console.log("editedValues", updated_item);
      try {
        switch (true) {
          case pageName == "user-management":
            setSelectedUsername(pmid);
            setSelectedUpdatedItem(updated_item);
            selectedEdit("edit");
            setIsModalOpen(true);
            actionRef.current = "clicked";

            break;
          case pageName == "property-management":
            console.log("updated_item", updated_item);

            setSelectedUsername(pmid);
            setSelectedUpdatedItem(updated_item);
            selectedEdit("propEdit");
            setIsModalOpen(true);

            break;
        }
      } catch (error) {
        console.log(error);
        // alert("error", error);
        // alert("Error deleting property");
      }
    },
  });
  const handleUserFinalEdit = async (selectedUsername, selectedUpdatedItem) => {
    console.log("username ase", selectedUsername);

    const userResponse = await fetch(
      `/api/user-edit-property/?user_id=${selectedUsername}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedUsername,
          updated_item: selectedUpdatedItem,
        }),
      }
    );
    if (userResponse.status == 200) {
      // alert("inside if cndition")
      setIsModalOpen(false);
      setShowModal(false);
      toast.success("User updated successfully!");
      actionRef.current = "clicked";
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const handleEditClick = async (user_id) => {
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
        console.log("response", response);

        const data = await response.json();
        console.log("response data:", data);

        const editData = data.data;

        if (editData) {
          console.log("editData", editData);
          // setShowModal(true);
          setApiSingleData(editData);

          setSelectedIds(editData.propertyAccess);
          // formik.setFieldValue("username", editData.username);
          formik.setFieldValue("userFullName", editData.userFullName);
          formik.setFieldValue("email", editData.email);
          formik.setFieldValue("phoneNumber", editData.phoneNumber);
          formik.setFieldValue("role", editData.role);
          formik.setFieldValue("propertyAccess", editData.propertyAccess);
          setPmid(editData.id);
        }

        // Assuming you need to show a message based on the response
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };
  /** handle edit click function end***/
//   multi select toggle dropdown start 
const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCheckboxChange = (option) => {
    const value = formik.values.propertyAccess || [];
    if (value.includes(option)) {
      formik.setFieldValue(
        'propertyAccess',
        value.filter((o) => o !== option)
      );
    } else {
      formik.setFieldValue('propertyAccess', [...value, option]);
    }
  };
  const handleClickOutside = (event) => {
    if (dropdownPropertyRef.current && !dropdownPropertyRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  //   multi select toggle dropdown end
  /* Editdelete dropdoen start*/
  const toggleDropdown = (id) => {
    setIsOpen(isOpen === id ? null : id);
  };

  /* Editdelete dropdoen start*/

  /* handle property edit function start*/
  const handlePropertyEditClick = async (property_id) => {
    if (property_id) {
      setIsLoading(true);
      setShowProertyEditModal(true);
      try {
        const response = await fetch(
          `/api/property-management-edit/?property_id=${property_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ property_id: property_id }),
          }
        );
        // console.log('response',response);
        const data = await response.json();
        // console.log('response data:', data);

        const editPropertyData = data.data;
        // console.log("editPropertyData", editPropertyData);
        if (editPropertyData) {
          formik.setFieldValue("property_name", editPropertyData.property_name);
          formik.setFieldValue("postalCode", editPropertyData.postalCode);
          if (editPropertyData.state) {
            formik.setFieldValue("state", editPropertyData.state);
            fetchCityData(editPropertyData.state);
          }
          formik.setFieldValue("city", editPropertyData.city);
          formik.setFieldValue("location", editPropertyData.location);
          formik.setFieldValue("total_units", editPropertyData.total_units);
          formik.setFieldValue(
            "propertyMobileNumber",
            editPropertyData.propertyMobileNumber
          );
          formik.setFieldValue("propertyEmail", editPropertyData.propertyEmail);
          formik.setFieldValue(
            "propertyWebsite",
            editPropertyData.propertyWebsite
          );
          formik.setFieldValue("description", editPropertyData.description);
          // setShowProertyEditModal(true);
          setPmid(editPropertyData.property_id);
          setApiSingleData(editPropertyData);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };
  const handlePropertyEditFinalClick = async (
    selectedUsername,
    selectedUpdatedItem
  ) => {
    // console.log("id and updated",selectedUpdatedItem ,selectedUsername)
    const propertyResponse = await fetch(
      `/api/property-management-update/?property_id=${selectedUsername}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: selectedUsername,
          updated_item: selectedUpdatedItem,
        }),
      }
    );

    if (propertyResponse.status == 200) {
      // alert("inside if cndition")
      setIsModalOpen(false);
      setShowProertyEditModal(false);
      toast.success("Property updated successfully!");
      actionRef.current = "clicked";
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const updateEditProperty = (property_id) => {
    // alert(property_id);
  };

  /* handle property edit function end */

  // console.log("slug", slug);
  const rerender = React.useReducer(() => ({}), {})[1];
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: maximumDisplayData, //default page size
  });
  const [sorting, setSorting] = useState([]);
  const getRoleStyles = (role) => {
    // console.log(role);
    switch (role) {
      case "Property Manager":
        return "text-026AA2 bg-F0F9FF";
      case "Regional Manager":
        return "text-C01048 bg-FFF1F3";
      case "Asset Manager":
        return "text-5925DC bg-F4F3FF";
      case "Investor":
        return "text-027A48 bg-ECFDF3";
        case "Admin":
        return "text-[#c59a00] bg-[#f5eeda]";
      // Add more cases as needed
      default:
        return "text-black bg-white";
    }
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const columns = columnsConfig.map(({ header, accessorKey }) =>
    columnHelper.accessor(accessorKey, {
      header: () => header,
      footer: (info) => info.column.id,
      cell:
        accessorKey === "action"
          ? ({ row }) => {
              // console.log(row.original);
              // console.log(slug);
              switch (true) {
                case slug == "" || slug == "daily-reports":
                  // console.log(row);
                  // setSelectedId(row.original.id);
                  break;
                case slug == "property-management":
                  setSelectedId(row.original.property_id);
                  // console.log(selectedId);
                  break;
                case slug == "user-management":
                  setSelectedId(row.original.id);
                  break;
              }
              // const id = row.original.id;
              // console.log("selectedId",selectedId);
              return (
                <div className="flex" ref={dropdownRef}>
                  {displayLinkWithIcon !== undefined && (
                    // console.log(slug)

                    <Link
                      href={`/dashboard/daily-reports/report-details/${row.original.report_id}`}
                    >
                      <Eye className="w-4 h-4 mr-2.5" />
                    </Link>
                    // <></>
                  )}
                  {displayVerticalIcon != undefined && (
                    <>
                      <div>
                        <MoreVertical
                          className="w-4 h-4 cursor-pointer relative"
                          aria-expanded={
                            isOpen === row.original.property_id ||
                            isOpen === row.original.id
                          }
                          aria-haspopup="true"
                          onClick={() =>
                            toggleDropdown(
                              // row.original
                              //     .property_id ||
                              row.original.id
                            )
                          }
                        />

                        {(isOpen === row.original.property_id ||
                          isOpen === row.original.id) && (
                          <div
                            className="z-10 origin-top-right absolute right-9 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabIndex="-1"
                          >
                            <div className="py-1" role="none">
                              {slug == "daily-reports" ||
                              slug == "" ||
                              slug == "analytics" ? (
                                <Link
                                  className="hidden"
                                  href={`/dashboard/daily-reports/edit-report/${row.original.id}`}
                                >
                                  Edit
                                </Link>
                              ) : (
                                <a
                                  onClick={() =>
                                    handlePropertyEditClick(
                                      row.original.property_id
                                    )
                                  }
                                  href="javascript:void(0)"
                                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-300 hover:text-blue-800"
                                  role="menuitem"
                                  tabIndex="-1"
                                  id="menu-item-0"
                                >
                                  Edit
                                </a>
                              )}

                              <a
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-300 hover:text-blue-800"
                                role="menuitem"
                                tabIndex="-1"
                                id="menu-item-1"
                                onClick={() =>
                                  handleAllDelete(
                                    pageName == "daily_reports"
                                      ? row.original.id
                                      : row.original.property_id
                                  )
                                }
                              >
                                {/* <Trash /> */}
                                Delete
                              </a>
                            </div>
                          </div>
                        )}
                        {/* EditDelete Dropdoen end */}
                      </div>
                    </>
                  )}
                  {displayTrashandPencilIcon != undefined && (
                    <>
                      <Edit2
                        onClick={() => {
                          handleEditClick(row.original.id);
                        }}
                        className="w-4 h-4 mr-2.5"
                      />
                      <Trash2
                        onClick={() => {
                          handleClick(row.original.id);
                        }}
                        className="w-4 h-4 "
                      />
                    </>
                  )}
                </div>
              );
            }
          : ({ getValue }) => {
              // Log the value to ensure it is being accessed correctly
              const value = getValue() || "NA";
              const trimmedValue = trimText(value, 100);
              if (accessorKey === "role") {
                const roleStyles = getRoleStyles(value);
                return (
                  <div
                    className={`break-words px-2.5 py-0.5 rounded-2xl w-max ${roleStyles}`}
                  >
                    {trimmedValue}
                  </div>
                );
              } else if (accessorKey === "status") {
                // Example for status case, similarly use capitalizeFirstLetter if needed
                const formattedStatus = capitalizeFirstLetter(value);
                return <div className="status-class">{formattedStatus}</div>;
              }
              return <div className="break-words">{trimmedValue}</div>;
            },
      enableSorting:
        accessorKey == "userFullName" ||
        accessorKey == "property_name" ||
        accessorKey == "city" ||
        accessorKey == "location" ||
        accessorKey == "propertyDate" ||
        accessorKey == "totalCollection" ||
        accessorKey == "currentMonthDeliquency" ||
        accessorKey == "occupiedUnits",
    })
  );
  const table = useReactTable({
    data: getData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination, // Ensure this is your pagination state
      sorting, // Ensure this is your sorting state
    },
    onPaginationChange: setPagination, // Function to update pagination state
    onSortingChange: setSorting, // Function to update sorting state
  });

  const totalPages = Math.ceil(data.length / pagination.pageSize);
  // Helper function to generate pagination numbers
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

  return (
    <>
      <div className="p-4">
        <table className="min-w-full divide-y divide-D0D5DD divide-dashed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pl-0 pr-4 py-3 text-left text-sm font-normal text-667085 uppercase tracking-wider whitespace-nowrap"
                  >
                    <button
                      className="flex items-center"
                      onClick={(event) => {
                        // console.log('Event:', event);
                        const toggleHandler =
                          header.column.getToggleSortingHandler();
                        if (toggleHandler) {
                          toggleHandler(event);
                        } else {
                          console.error(
                            "Toggle handler is undefined for column:",
                            header.column.id
                          );
                        }
                      }}
                    >
                      {header.isPlaceholder
                        ? "Abc"
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      { 
                      header.column.columnDef.accessorKey == "property_name" ||header.column.columnDef.accessorKey == "userFullName" || header.column.columnDef.accessorKey == "propertyDate" || header.column.columnDef.accessorKey == "city" ||
                      header.column.columnDef.accessorKey == "location"? (
                        header.column.getIsSorted() === "asc" ? (
                        <ChevronUp className="w-3.5" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ChevronDown className="w-3.5" />
                      ) : <ChevronUp className="w-3.5" />
                      ) : ("")
                      }
                      {" "}
                      {/* Sorting indicators icons */}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-D0D5DD divide-dashed">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getHeaderGroups()[0].headers.length}
                  className="text-center py-[100px] text-xl text-344054 font-normal"
                >
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="pl-0 pr-4 py-4 whitespace-normal text-sm text-344054 font-normal"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {showPaginationButton != undefined && (
          <div className="flex justify-between items-center mt-4 py-3">
            <button
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 1)
              }
              disabled={!table.getCanPreviousPage()}
              className="border border-D0D5DD font-semibold px-3.5 py-2 flex text-344054 text-sm gap-2"
            >
              <ArrowLeft className="text-344054 w-5 h-5" />
              Previous
            </button>
            <div className="flex-1 flex justify-center items-center space-x-1">
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
              Next
              <ArrowRight className="text-344054 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <ConfirmatioModal
        report_id={selectedReport_id}
        property_id={selectedProperty_id}
        username={selectedUsername}
        updated_item={selectedUpdatedItem}
        onPropertyEdit={handlePropertyEditFinalClick}
        ondailyReportEdit={"report"}
        userEdit={edit}
        action={actionRef.current}
        onDelete={handleDelete}
        onPropertydelete={handlePropertyDelete}
        userEditfinal={handleUserFinalEdit}
        ondailyReportDelete={handleDailyReportFinalDelete}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit model start */}
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-gray-600 bg-opacity-50">
          <div
            className={`relative w-auto my-6 mx-auto max-w-3xl ${
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
                        {/* <label className="block w-[50%]">
                                                    <span className="block text-sm font-medium text-slate-700">
                                                        Username
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        value={
                                                            formik.values
                                                                .username
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        onBlur={
                                                            formik.handleBlur
                                                        }
                                                        className="mt-2 px-[14px] py-[10px] bg-slate-200 border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                                                        placeholder="Enter your Name"
                                                        readOnly
                                                    />
                                                    {formik.touched.username &&
                                                        formik.errors
                                                            .username && (
                                                            <div className="error text-red text-sm font-normal mt-1.5">
                                                                {
                                                                    formik
                                                                        .errors
                                                                        .username
                                                                }
                                                            </div>
                                                        )}
                                                </label> */}
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
                              className="appearance-none w-full px-3.5 py-2.5 bg-white border sm:text-sm focus:outline-none focus:ring-2  overflow-auto"
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
                                className={`inline-flex ${formik.values.propertyAccess.length == 0 ? "text-slate-400" : "text-black"} justify-between w-full py-2.5 border border-gray-300 shadow-sm px-4 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:border-black focus:border-[3px] focus:rounded-md focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}
                              >
                                {formik.values.propertyAccess.length == 0 ? "Select Properties" : formik.values.propertyAccess.length + " Properties Selected"}
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
                                            formik.values.propertyAccess.includes(option.property_id)
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
      {/* Edit model end */}

      {/* Property Edit model start */}
      {showProertyEditModal ? (
        <div className="flex justify-center backdrop-blur items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          {/* <div className={`relative w-auto my-6 mx-auto max-w-3xl`}> */}
          <div
            className={`relative w-auto my-6 mx-auto max-w-3xl ${
              showProertyEditModal ? "scale-100 animate-fadeIn" : "scale-0"
            }`}
          >
            <div className="w-full lg:w-[780px] sm:w-full  border border-border-A4A4A9 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
              {isLoading ? (
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
                      onClick={() => setShowProertyEditModal(false)}
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
                        onClick={() => setShowProertyEditModal(false)}
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

export default Table;
