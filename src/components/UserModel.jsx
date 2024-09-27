// components/UserModal.js
"use client";
import { useFormik } from "formik";

import React, { useEffect, useRef, useState } from "react";
import { Mail, Globe } from "feather-icons-react";
import Button from "./Button";
import {
  defaultValue,
  validationSchema,
} from "@/validation/userModelValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import useAuthStore from "@/store/AuthStore";
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

const UserModal = ({ btn_title, dataProperty, listingFunction }) => {
  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);
  const buttonDisabled = useRef(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [dataProperty, setDataProperty] = useState();
  // useEffect(() => {
  //   const getProperty = async () => {
  //     try {
  //       const response = await fetch(`/api/get-all-property`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       // console.log('response',response);
  //       // if (!response.ok) {
  //       //     throw new Error('Failed to get property');
  //       // }
  //       const data = await response.json();
  //       // console.log('response data:', data.data);
  //       setDataProperty(data.data);
  //     } catch (err) {
  //       console.error("Error get all property:", err);
  //     }
  //   };
  //   getProperty();
  // }, []);
  useEffect(() => {
    const loadSelect2 = async () => {
      if (selectRef1.current) {
        // Dynamically import Select2
        await import("select2");
        const $categorySelect = $(selectRef1.current);
        $categorySelect.select2({
          placeholder: "Select a category",
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
        // $(selectRef1.current).select2({
        //   placeholder: "Select Property",
        // }).on("change", function (e) {
        //   const selectedPropertyId = Array.from(e.target.selectedOptions, (option) => option.value);
        //   // console.log(selectedPropertyId);
        //   formik.setFieldValue("propertyAccess", selectedPropertyId);
        // });

        // Clean up on component unmount
        // return () => {
        //   $(selectRef1.current).select2("destroy");
        //   // $(selectRef2.current).select2("destroy");
        // };
      }
    };

    loadSelect2();
  });
  const handleToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (option) => {
    // console.log(option);
    
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
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: validationSchema,
    onSubmit: async function (values) {
      setIsDisabled(true);
      // console.log("values....");
      try {
        const response = await fetch(`/api/create-user-management`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        // console.log("response", response);
        // if (!response.ok) {
        //   throw new Error("Failed to delete property");
        // }
        if (response.status == 200) {
          setShowModal(false);
          formik.resetForm();
          listingFunction();
          toast.success("User Created Successfully!");
          // window.location.reload();
        } else {
          toast.error("User Email Id Already Exist")
          buttonDisabled.current.innerHTML = "Add User";
          setIsDisabled(false);
        }
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    },
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  // useEffect(() => {
  //   const newValue = selectedCities.map((city) => city.name).join(", ");
  //   if (formik.values.propertyAccess !== newValue) {
  //     formik.setFieldValue("propertyAccess", newValue);
  //   }
  // }, [selectedCities, formik.values.propertyAccess]);
  const {storedRole} = useAuthStore()

  return (
    <>
    {
      storedRole == 'Admin' && 
      <Button
      title={btn_title}
      displayButton="true"
      title_color="text-E6EAEB"
      bgColor="bg-custom_bg_button"
      padding_top_bottom="py-0"
      padding_left_right="px-5"
      fontSize="text-lg"
      font_weight="font-semibold"
      margin_left="md:ml-2"
      onClick={() => setShowModal(true)}
      />
     } 
      {showModal ? (
        <div className="fixed inset-0 z-50 flex  overflow-x-hidden overflow-y-auto justify-center backdrop-blur bg-gray-600 bg-opacity-50">
          {/* <Dummy /> */}
          <div
            className={`relative w-auto  h-auto m-auto max-w-3xl ${
              showModal ? "scale-100 animate-fadeIn" : "scale-0"
            }`}
          >
            <div className="w-[780px] border border-border-A4A4A9 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between pt-6 pr-6 pl-6 pb-0 rounded-t">
                <div className="modelHeading">
                  <h3 className="font-bold text-15151C text-lg">Add User</h3>
                  <div className="contentModelHeading text-344054 text-sm">
                    Your overview hub for seamless management.
                  </div>
                </div>
                <button
                  className="bg-gray-300 p-1 rounded-full border-0 float-right"
                  onClick={() => {setShowModal(false);formik.resetForm();}}
                >
                  <img src="/x.svg" alt="close Icon" />
                </button>
              </div>
              <div className="relative p-[32px] flex-auto">
                <form className="rounded w-full" onSubmit={formik.handleSubmit}>
                  <div className="mailNofields flex flex-row ">
                    <label className="block w-[100%]">
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
                  <label className="block w-[100%] mt-[20px]">
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
                      <span className=" block text-sm font-medium text-slate-700">
                        Password
                      </span>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                        placeholder="Password"
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="error text-red text-sm font-normal mt-1.5">
                          {formik.errors.password}
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="mailNofields flex flex-row">
                    <div className="selectDiv  w-[50%] mr-[20px] flex flex-col mt-5">
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
                          className="appearance-none w-full px-3.5 py-2 bg-white border sm:text-sm focus:outline-none focus:ring-2  overflow-auto"
                          size="1"
                        >
                          <option value="" className="text-slate-400" disabled>
                            Select Role
                          </option>
                          <option value="Regional Manager">
                            Regional Manager
                          </option>
                          <option value="Property Manager">
                            Property Manager
                          </option>
                          <option value="Asset Manager">Asset Manager</option>
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
                    <div className="flex mt-5 justify-center flex-col w-[50%]">
                      <label
                        htmlFor="property"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Select Property
                      </label>
                      {/* <div className="relative mt-2"> */}
                      {/* <select
                        name="propertyAccess"
                        ref={selectRef1}
                        multiple
                        className="form-control text-black border shadow-sm border-slate-300"
                      >
                        {dataProperty &&
                          Array.isArray(dataProperty) &&
                          dataProperty.length > 0 &&
                          dataProperty.map((properties) => (
                            // console.log(properties)
                            <option
                              key={properties.property_name}
                              value={properties.id}
                            >
                              {properties.property_name}
                            </option>
                          ))}
                      </select> */}
                      {/* multi select dropdown start */}
                      <div
                        className="relative inline-block mt-2 text-left"
                        ref={dropdownRef}
                      >
                        <div>
                          <button
                            type="button"
                            id="dropdownToggle"
                            onClick={handleToggleClick}
                            className={`inline-flex ${formik.values.propertyAccess.length == 0 ? "text-slate-400" : "text-black"}  justify-between w-full py-2.5 border border-gray-300 shadow-sm px-4 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:border-black focus:border-[3px] focus:rounded-md focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}
                          >
                            {formik.values.propertyAccess.length == 0 ? "Select Properties" : formik.values.propertyAccess.length + " Properties Selected"}
                            {/* {selectedOptions && selectedOptions.length > 0
                              ? selectedOptions
                                  .map(
                                    (option) =>
                                      propertyData.find(
                                        (o) => o.property_id === option
                                      ).property_name
                                  )
                                  // .map((option) => options.find((o) => o.value === option).label)
                                  .join(", ")
                              : "Select Options"} */}
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
                                  // console.log(option)

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
                                        handleCheckboxChange(option.property_id)
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
                      </div>
                      {/* multi select dropdown end */}
                      {formik.touched.propertyAccess &&
                        formik.errors.propertyAccess && (
                          <div className="error text-red text-sm font-normal mt-1.5">
                            {formik.errors.propertyAccess}
                          </div>
                        )}
                    </div>
                    <div></div>
                  </div>

                  <div className="flex items-center justify-end pt-7  rounded-b">
                    <button
                      className={`w-full font-bold text-15151C py-[12px] px-[20px] mr-[8px] border-2 border-black ${
                        isDisabled
                          ? " cursor-not-allowed hover:bg-gray-700"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {setShowModal(false);formik.resetForm();}}
                    >
                      Cancel
                    </button>
                    <button
                      ref={buttonDisabled}
                      className={`w-full font-bold text-white bg-black py-[12px] px-[20px] border-2 border-black ${
                        isDisabled
                          ? " cursor-not-allowed hover:bg-gray-700"
                          : ""
                      }`}
                      type="submit"
                      // onClick={()=>setShowModal(false)}
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UserModal;
