"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import { Mail, Globe } from "feather-icons-react";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import {
  propertyDefaultValue,
  propertyValidationSchema,
} from "@/validation/propertyModel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import useAuthStore from "@/store/AuthStore";
const PropertyModel = ({ btn_title,statelist,propertyListingFun }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [statelist, setStatelist] = useState();
  const [citylist, setCitylist] = useState();
  const stateSelectRef = useRef();
  const buttonDisabled = useRef(false);
  const citySelectRef = useRef();
  const selectedPropertyText = useRef("");
  useEffect(() => {
    const loadSelect2 = async () => {
      if (stateSelectRef.current
        //  && citySelectRef.current
        )
          {
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
  }, [statelist]);
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);
  // useEffect(() => {
  //   const fetchStateData = async () => {
  //     try {
  //       const response = await fetch(
  //         "/api/state-listing",
  //         { method: "GET" },
  //         { cache: "no-cache" }
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const records = await response.json();
  //       // setUserData(records);
  //       console.log(records);
  //       setStatelist(records);
  //     } catch (error) {
  //       console.error("Error fetching state data:", error);
  //     }
  //   };

  //   fetchStateData();
  // }, [showModal]);
  const formik = useFormik({
    initialValues: propertyDefaultValue,
    validationSchema: propertyValidationSchema,
    onSubmit: async function (values) {
      setIsDisabled(true);
      // console.log(buttonDisabled);
      buttonDisabled.current.innerHTML = "Saving..."
      // buttonDisabled.current.classList.add('')
      // console.log("values....");
      // console.log(values);
      // console.log(selectedPropertyText.current.value);
      // const propertyText = selectedPropertyText.current.value;
      const mergerequestBody = { ...values };
      // console.log(mergerequestBody);
      
      try {
        const response = await fetch(`/api/create-property-management`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mergerequestBody),
        });
        // console.log("response", response);
        // if (!response.ok) {
        //     throw new Error('Failed to fetch property');
        // }
        if (response.status == 200) {
          setShowModal(false);
          formik.resetForm();
          propertyListingFun();
          toast.success("property added successfully!");
          // window.location.reload();
        }
        else{
          buttonDisabled.current.innerHTML = "Add Property"
          setIsDisabled(false)
        }
        
        // alert('Property deleted successfully');
        // setGetData(getData.filter(property => property.property_id !== property_id));
      } catch (error) {
        console.error("Error deleting property:", error);
        // alert('error while deleting record')
        // alert('Error deleting property');
      }
    },
  });
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
  const handleStateChange = (e) => {
    console.log(e.target.value);
    const selectedState = e.target.value;
    formik.setFieldValue("state", selectedState);
    // fetchCityData(selectedState);
  };
  const {storedRole} = useAuthStore()

  return (
    <>
    {
      storedRole == 'Admin' && 
      <Button
      title={btn_title}
      textHover="hover:text-red-600"
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
        <div className="flex justify-center backdrop-blur overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          {/* <div className={`relative w-auto my-6 mx-auto max-w-3xl`}> */}
          <div
            className={`relative w-auto h-full my-6 mx-auto max-w-3xl ${
              showModal ? "scale-100 animate-fadeIn" : "scale-0"
            }`}
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="w-full lg:w-[780px] sm:w-full l:mt-0 xl:mt-0 mt-[40px] border border-border-A4A4A9 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
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
                    onClick={() => {setShowModal(false);formik.resetForm();}}
                  >
                    <img src="/x.svg" alt="close Icon" srcSet="" />
                  </button>
                </div>
                <div className="relative p-[32px] flex-auto">
                  <div className="rounded  w-full">
                    <div className="mailNofields flex flex-row max-[600px]:flex-col items-start">
                      <label className="block w-[50%] max-[600px]:w-[100%] mr-[20px]">
                        <span className=" block text-sm font-medium text-slate-700">
                          Property Name
                        </span>
                        <input
                          type="text"
                          name="property_name"
                          ref={selectedPropertyText}
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
                      <label className="block w-[50%] max-[600px]:w-[100%]">
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
                    <div className="RoleSelectFields flex flex-row max-[600px]:flex-col mt-[20px]">
                      {/* <label className="block w-[50%] mr-[20px]">
                                                <span className=" block text-sm font-medium text-slate-700">
                                                    Role
                                                </span>
                                                
                                                <input type="email" name="email" className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full  sm:text-sm" placeholder="you@example.com" />
                                            </label> */}
                      {/* <label className="block w-[50%]">
                                                <span className=" block text-sm font-medium text-slate-700">
                                                Select Property
                                                </span>
                                                <input type="number" name="Mobile Number" className="mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="enter your phone number" />
                                            </label> */}
                      <div className="selectDiv w-[50%] max-[600px]:w-[100%] mr-[20px] flex flex-col items-start">
                        <label
                          htmlFor="countries"
                          className="block text-sm font-medium text-slate-700"
                        >
                          State
                        </label>
                        <div className="relative mt-2 w-full">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="w-5 h-5 text-gray-400" />
                          </div>
                          <select
                            ref={stateSelectRef}
                            id="state"
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
                          className="block text-sm font-medium text-slate-700"
                        >
                          City
                        </label>
                        <div className="relative mt-2">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="w-5 h-5 text-gray-400" />
                          </div>
                          <select
                            ref={citySelectRef}
                            id="countries"
                            name="city"
                            value={formik.values.city}
                            // onChange={formik.handleChange}
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
                              Array.isArray(citylist) &&
                              citylist.length > 0 &&
                              citylist.map((cities, index) => (
                                // console.log(states, index)
                                <option key={index} value={cities}>
                                  {cities}
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
                        {formik.touched.city && formik.errors.city && (
                          <div className="error text-red text-sm font-normal mt-1.5">
                            {formik.errors.city}
                          </div>
                        )}
                      </div> */}
                      <label className="block w-[50%] max-[600px]:w-[100%]">
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
                    <div className="mailNofields flex flex-row max-[600px]:flex-col mt-[20px]">
                      <label className="block w-[50%] max-[600px]:w-[100%] mr-[20px]">
                        <span className="block text-sm font-medium text-slate-700">
                        Street Address
                        </span>
                        <div className="relative mt-2">
                          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div> */}
                          <input
                            type="text"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            className=" px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm"
                            placeholder="Enter Street Address"
                          />
                        </div>
                        {formik.touched.location && formik.errors.location && (
                          <div className="error text-red text-sm font-normal mt-1.5">
                            {formik.errors.location}
                          </div>
                        )}
                      </label>
                      <label className="block w-[50%] max-[600px]:w-[100%]">
                        <span className=" block text-sm font-medium text-slate-700">
                          Total Unit
                        </span>
                        <div className="relative mt-2">
                          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="w-5 h-5 text-gray-400" />
                          </div> */}
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
                    <div className="mailNofields flex flex-row max-[600px]:flex-col mt-[20px]">
                      <label className="block w-[50%] max-[600px]:w-[100%] mr-[20px]">
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
                      <label className="block w-[50%] max-[600px]:w-[100%]">
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
                    className={`w-full font-bold text-15151C py-[12px] px-[20px] mr-[8px] border-2 border-black ${
                      isDisabled ? " cursor-not-allowed hover:bg-gray-700" : ""
                    }`}
                    type="button"
                    onClick={() => {setShowModal(false);formik.resetForm();}}
                  >
                    Cancel
                  </button>
                  <button ref={buttonDisabled}
                    className={`w-full font-bold bg-black text-white  py-[12px] px-[20px] mr-[8px] border-2 border-black ${
                      isDisabled ? " cursor-not-allowed hover:bg-gray-700" : ""
                    }`}
                    type="submit"
                    // onClick={()=>setShowModal(false)}
                  >
                    Add Property
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PropertyModel;
