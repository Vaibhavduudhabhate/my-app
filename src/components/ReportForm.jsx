"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import { defaultValue, validationSchema } from "@/validation/reportValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmatioModal from "./ConfirmationBox";

const ReportForm = ({ currencyData }) => {
    const navigate = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertyData, setPropertyData] = useState(false);
    const [reportValues, setReportValues] = useState("");

    setReportValues
    const buttonDisable = useRef();
    const saveAsDraft = useRef();
    const propertyName = useRef("");

    const handlePropertyChange = async(event) => {
        const selectedId = event.target.value;
        const el = document.getElementById("property_id");
        const selectedOption = el.options[el.selectedIndex].text;
        console.log(selectedOption)
        propertyName.current = selectedOption
            formik.handleChange(event);
            try {
                const response = await fetch(`/api/total-gross`, { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body:JSON.stringify({ selectedPropertyId: selectedId }),
                     cache: "no-cache" });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const records = await response.json();
                console.log("records", records.data);
                // priorMonthDeliquencySum
                // console.log("")
                formik.setFieldValue('grossCollection', records.data.collection);
                formik.setFieldValue('priorMonthDeliquency', records.data.priorMonthDeliquencySum);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/property-listing', { method: "GET", cache: "no-cache" });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const records = await response.json();
                console.log("records", records); // For debugging
                setPropertyData(records);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: async function (values) {
            const selectedPropertyName = propertyName.current
            // console.log(propertyName.current);
            const mergevalues = {propertyName: propertyName.current, ...values}
            // console.log(mergevalues);
            
            setIsModalOpen(true);
            setReportValues(mergevalues)
            // submit button disbaled start
            buttonDisable.current.innerHTML = "Saving...";
            buttonDisable.current.disabled = true;
            buttonDisable.current.classList.add("cursor-not-allowed");
            buttonDisable.current.classList.add("hover:text-white");
            buttonDisable.current.classList.add("hover:bg-gray-700");
            // submit button disbaled end
            // save as draft button disbaled start
            saveAsDraft.current.disabled = true;
            saveAsDraft.current.classList.add("cursor-not-allowed");
            saveAsDraft.current.classList.add("hover:bg-gray-700");
            saveAsDraft.current.classList.add("hover:text-white");
            // save as draft button disbaled end
            // try {
            //     // Set the status to "active" in the values object
            //     const updatedValues = { ...values, status: "active" };
            //     const response = await fetch(`/api/create-property-report`, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(updatedValues),
            //     });
            //     console.log("response", response);
            //     if (response.ok) {
            //         // Redirect to /dashboard/daily-reports if the response is OK (200 status)
            //         //
            //         navigate.push("/dashboard/daily-reports");
            //         toast.success("New Report Added Successfully");
            //         buttonDisable.current.innerHTML = "Submit";
            //         buttonDisable.current.classList.remove("disabled");
            //         buttonDisable.current.disabled = false;
            //         buttonDisable.current.classList.remove("cursor-not-allowed");
            //         buttonDisable.current.classList.remove("hover:text-black");
            //         buttonDisable.current.classList.remove("hover:bg-gray-700");

            //         saveAsDraft.current.classList.remove("disabled");
            //         saveAsDraft.current.disabled = false;
            //         saveAsDraft.current.classList.remove("cursor-not-allowed");
            //         saveAsDraft.current.classList.remove("hover:bg-gray-700");
            //         saveAsDraft.current.classList.remove("hover:text-white");
            //     }
            // } catch (error) {
            //     buttonDisable.current.innerHTML = "Submit";
            //     buttonDisable.current.classList.remove("disabled");
            //     buttonDisable.current.disabled = false;
            //     buttonDisable.current.classList.remove("cursor-not-allowed");
            //     buttonDisable.current.classList.remove("hover:bg-gray-700");
            //     buttonDisable.current.classList.remove("hover:text-black");
            //     saveAsDraft.current.classList.remove("disabled");
            //     saveAsDraft.current.disabled = false;
            //     saveAsDraft.current.classList.remove("cursor-not-allowed");
            //     saveAsDraft.current.classList.remove("hover:bg-gray-700");
            //     saveAsDraft.current.classList.remove("hover:text-white");
            //     console.error(
            //         "Error creating property report property:",
            //         error
            //     );
            // }
        },
    });
    const handleAddClick = async(values)=>{
        try {
            // Set the status to "active" in the values object
            
            const updatedValues = { ...values, status: "active" };
            const response = await fetch(`/api/create-property-report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedValues),
            });
            console.log("response", response);
            if (response.ok) {
                // Redirect to /dashboard/daily-reports if the response is OK (200 status)
                //
                setIsModalOpen(false);
                navigate.push("/dashboard/daily-reports");
                toast.success("New Report Added Successfully");
                buttonDisable.current.innerHTML = "Submit";
                buttonDisable.current.classList.remove("disabled");
                buttonDisable.current.disabled = false;
                buttonDisable.current.classList.remove("cursor-not-allowed");
                buttonDisable.current.classList.remove("hover:text-black");
                buttonDisable.current.classList.remove("hover:bg-gray-700");

                saveAsDraft.current.classList.remove("disabled");
                saveAsDraft.current.disabled = false;
                saveAsDraft.current.classList.remove("cursor-not-allowed");
                saveAsDraft.current.classList.remove("hover:bg-gray-700");
                saveAsDraft.current.classList.remove("hover:text-white");
            }
        } catch (error) {
            buttonDisable.current.innerHTML = "Submit";
            buttonDisable.current.classList.remove("disabled");
            buttonDisable.current.disabled = false;
            buttonDisable.current.classList.remove("cursor-not-allowed");
            buttonDisable.current.classList.remove("hover:bg-gray-700");
            buttonDisable.current.classList.remove("hover:text-black");
            saveAsDraft.current.classList.remove("disabled");
            saveAsDraft.current.disabled = false;
            saveAsDraft.current.classList.remove("cursor-not-allowed");
            saveAsDraft.current.classList.remove("hover:bg-gray-700");
            saveAsDraft.current.classList.remove("hover:text-white");
            console.error(
                "Error creating property report property:",
                error
            );
        }
    }
    /** Save As dtaft start**/
    const handleSaveAsDraft = async (values) => {
        buttonDisable.current.disabled = true;
        buttonDisable.current.classList.add("cursor-not-allowed");
        buttonDisable.current.classList.add("hover:bg-gray-700");
        buttonDisable.current.classList.add("hover:text-white");
        // submit button disbaled end
        // save as draft button disbaled start
        saveAsDraft.current.innerHTML = "Saving...";
        saveAsDraft.current.disabled = true;
        saveAsDraft.current.classList.add("cursor-not-allowed");
        saveAsDraft.current.classList.add("hover:bg-gray-700");
        saveAsDraft.current.classList.add("hover:text-white");
        try {
            const updatedValues = { ...values, status: "draft" };
            const response = await fetch("/api/create-property-report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedValues),
            });
            console.log("response...", response);
            const data = await response.json();
            console.log("response data:", data);
            if (response.ok) {
                toast.success("New Report Added Successfully");
                navigate.push("/dashboard/daily-reports");
                buttonDisable.current.innerHTML = "Submit";
                buttonDisable.current.classList.remove("disabled");
                buttonDisable.current.disabled = false;
                buttonDisable.current.classList.remove("cursor-not-allowed");
                buttonDisable.current.classList.remove("hover:text-white");
                buttonDisable.current.classList.remove("hover:bg-gray-700");
                saveAsDraft.current.innerHTML = "Save as Draft";
                saveAsDraft.current.classList.remove("disabled");
                saveAsDraft.current.disabled = false;
                saveAsDraft.current.classList.remove("cursor-not-allowed");
                saveAsDraft.current.classList.remove("hover:bg-gray-700");
                saveAsDraft.current.classList.remove("hover:text-white");
            }

            // Reload the page or handle the response as needed
            // window.location.reload();
        } catch (error) {
            buttonDisable.current.innerHTML = "Submit";
            buttonDisable.current.classList.remove("disabled");
            buttonDisable.current.disabled = false;
            buttonDisable.current.classList.remove("cursor-not-allowed");
            buttonDisable.current.classList.remove("hover:bg-gray-700");
            saveAsDraft.current.innerHTML = "Save as Draft";
            saveAsDraft.current.classList.remove("disabled");
            saveAsDraft.current.disabled = false;
            saveAsDraft.current.classList.remove("cursor-not-allowed");
            saveAsDraft.current.classList.remove("hover:bg-gray-700");
            saveAsDraft.current.classList.remove("hover:text-white");
            console.error("Error creating property report:", error);
        }
    };
    /** Save As dtaft end**/

    useEffect(() => {
        // Calculate the total whenever rentCollected or otherIncome changes
        const rentCollected = parseFloat(formik.values.rentCollected) || 0;
        const otherIncome = parseFloat(formik.values.otherIncome) || 0;
        const total = rentCollected + otherIncome;
        formik.setFieldValue("totalCollection", total);
    }, [formik.values.rentCollected, formik.values.otherIncome]);

    useEffect(() => {
        //Vacant = Total Units - Occupied + Move Outs - Approved Move Ins.
        const totalUnits = parseFloat(formik.values.totalUnits) || 0;
        const occupiedUnits = parseFloat(formik.values.occupiedUnits) || 0;
        const noOfMoveOuts = parseFloat(formik.values.noOfMoveOuts) || 0;
        const approvedMoveIns = parseFloat(formik.values.approvedMoveIns) || 0;

        const totalVacant = totalUnits - occupiedUnits + noOfMoveOuts - approvedMoveIns

        console.log("totalVacant");
        console.log(totalVacant);

        formik.setFieldValue("vacantUnits", totalVacant);


    }, [formik.values.totalUnits, formik.values.occupiedUnits, formik.values.noOfMoveOuts, formik.values.approvedMoveIns]);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="border-b-1x border-D0D5DD pb-2 mb-5 flex items-center flex-wrap  md:flex-nowrap gap-x-2">
                    <div className="w-full md:w-3/4">
                        <h4 className="text-base font-semibold text-101828">
                            Enter property data
                        </h4>
                        <p className="text-sm font-normal text-344054">
                            provide data of your property collection
                        </p>
                    </div>
                    <div className="w-full md:w-1/4 text-right">
                        <button
                            className="text-base font-semibold text-D92D20"
                            type="reset"
                            onClick={() => formik.resetForm()}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Property Information
                </div>
                <div className="border-1x border-D0D5DD p-3 setIsModalOpen(true); flex flex-wrap  md:flex-nowrap gap-x-2 mb-5">
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Select Property
                        </label>
                        <div className="relative">
                            <select
                                id="property_id"
                                name="property_id"
                                value={formik.values.property_id}
                                onChange={handlePropertyChange}
                                className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            >
                                <option selected>Select Property</option>
                                {propertyData &&
                                    propertyData.length > 0 &&
                                    propertyData.map((item) => (
                                        <option
                                            value={item.property_id}
                                            key={item.property_id}
                                        >
                                            {item.property_name}
                                        </option>
                                    ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1L5 5L9 1"
                                        stroke="#101828"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        {formik.touched.property_id &&
                            formik.errors.property_id && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.property_id}
                                </div>
                            )}
                    </div>
                    <div className="w-full md:flex-1">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Select Date
                        </label>
                        <input
                            type="date"
                            name="propertyDate"
                            id="propertyDate"
                            value={formik.values.propertyDate}
                            onChange={formik.handleChange}
                            className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                        />
                        {formik.touched.propertyDate &&
                            formik.errors.propertyDate && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.propertyDate}
                                </div>
                            )}
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Collection Data of 25 Jun 2024
                </div>
                <div className="border-1x border-D0D5DD p-3 mb-5">
                    <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2">
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                Rent Collected
                            </label>
                            <div className="flex w-full">
                                <div className="relative w-75">
                                    <select
                                        id="rentCurrency"
                                        name="currency"
                                        value={formik.values.currency}
                                        onChange={formik.handleChange}
                                        className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                    >
                                        {currencyData.map((currency, index) => (
                                            <option
                                                key={index}
                                                value={currency.symbol}
                                            >
                                                {currency.code}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg
                                            width="13"
                                            height="8"
                                            viewBox="0 0 13 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1.5 1.5L6.5 6.5L11.5 1.5"
                                                stroke="#667085"
                                                strokeWidth="1.66667"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-c-width">
                                    <input
                                        type="text"
                                        name="rentCollected"
                                        id="rentCollected"
                                        value={formik.values.rentCollected}
                                        onChange={formik.handleChange}
                                        className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                    />
                                </div>
                            </div>
                            {formik.touched.rentCollected &&
                                formik.errors.rentCollected && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.rentCollected}
                                    </div>
                                )}
                        </div>
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                Other Income
                            </label>
                            <div className="flex w-full">
                                <div className="relative w-75">
                                    <select
                                        id="otherIncomeCurrency"
                                        name="currency"
                                        value={formik.values.currency}
                                        onChange={formik.handleChange}
                                        className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                    >
                                        {currencyData.map((currency, index) => (
                                            <option
                                                key={index}
                                                value={currency.symbol}
                                            >
                                                {currency.code}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg
                                            width="13"
                                            height="8"
                                            viewBox="0 0 13 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1.5 1.5L6.5 6.5L11.5 1.5"
                                                stroke="#667085"
                                                strokeWidth="1.66667"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-c-width">
                                    <input
                                        type="text"
                                        id="otherIncome"
                                        name="otherIncome"
                                        value={formik.values.otherIncome}
                                        onChange={formik.handleChange}
                                        className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                    />
                                </div>
                            </div>
                            {formik.touched.otherIncome &&
                                formik.errors.otherIncome && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.otherIncome}
                                    </div>
                                )}
                        </div>
                        <div className="h-h44 flex items-center w-full text-center md:w-auto md:mt-6">
                            <svg
                                width="8"
                                height="6"
                                viewBox="0 0 8 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.272727 1.88636V0.659091H7.27273V1.88636H0.272727ZM0.272727 5.25V4.02273H7.27273V5.25H0.272727Z"
                                    fill="#101828"
                                />
                            </svg>
                        </div>
                        <div className="w-full md:flex-1">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                Total Collection (Rent Collected + Other Income)
                            </label>
                            <input
                                type="text"
                                name="totalCollection"
                                id="totalCollection"
                                value={formik.values.totalCollection}
                                onChange={formik.handleChange}
                                readOnly
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.totalCollection &&
                                formik.errors.totalCollection && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.totalCollection}
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="w-full mt-2 md:flex-1">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Total Gross collection till today (Sum of total
                            collection of all months)
                        </label>
                        <input
                            type="text"
                            name="grossCollection"
                            id="grossCollection"
                            value={formik.values.grossCollection}
                            onChange={formik.handleChange}
                            readOnly
                            className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                        />
                        {formik.touched.grossCollection &&
                            formik.errors.grossCollection && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.grossCollection}
                                </div>
                            )}
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Delinquency Data
                </div>
                <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2 border-1x border-D0D5DD p-3 mb-5">
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Current month Delinquency
                        </label>
                        <div className="flex w-full">
                            <div className="relative w-75">
                                <select
                                    id="currentMonthDCurrency"
                                    name="currency"
                                    value={formik.values.currency}
                                    onChange={formik.handleChange}
                                    className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                >
                                    {currencyData.map((currency, index) => (
                                        <option
                                            key={index}
                                            value={currency.symbol}
                                        >
                                            {currency.code}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                        width="13"
                                        height="8"
                                        viewBox="0 0 13 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.5 1.5L6.5 6.5L11.5 1.5"
                                            stroke="#667085"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-c-width">
                                <input
                                    type="text"
                                    id="currentMonthDeliquency"
                                    name="currentMonthDeliquency"
                                    value={formik.values.currentMonthDeliquency}
                                    onChange={formik.handleChange}
                                    className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                />
                            </div>
                        </div>
                        {formik.touched.currentMonthDeliquency &&
                            formik.errors.currentMonthDeliquency && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.currentMonthDeliquency}
                                </div>
                            )}
                    </div>
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Prior month Delinquency
                        </label>
                        <div className="flex w-full">
                            <div className="relative w-75">
                                <select
                                    id="PriorMonthCurrency"
                                    name="currency"
                                    value={formik.values.currency}
                                    onChange={formik.handleChange}
                                    className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                >
                                    {currencyData.map((currency, index) => (
                                        <option
                                            key={index}
                                            value={currency.symbol}
                                        >
                                            {currency.code}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                        width="13"
                                        height="8"
                                        viewBox="0 0 13 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.5 1.5L6.5 6.5L11.5 1.5"
                                            stroke="#667085"
                                            strokeWidth="1.66667"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-c-width">
                                <input
                                    type="text"
                                    id="priorMonthDeliquency"
                                    name="priorMonthDeliquency"
                                    value={formik.values.priorMonthDeliquency}
                                    onChange={formik.handleChange}
                                    className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                                />
                            </div>
                        </div>
                        {formik.touched.priorMonthDeliquency &&
                            formik.errors.priorMonthDeliquency && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.priorMonthDeliquency}
                                </div>
                            )}
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Occupancy Data
                </div>
                <div className="border-1x border-D0D5DD p-3 mb-5">
                    <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2">
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                Total no. of Units
                            </label>
                            <input
                                type="text"
                                id="totalUnits"
                                name="totalUnits"
                                value={formik.values.totalUnits}
                                onChange={formik.handleChange}
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.totalUnits &&
                                formik.errors.totalUnits && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.totalUnits}
                                    </div>
                                )}
                        </div>
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                No. of Occupied
                            </label>
                            <input
                                type="text"
                                id="occupiedUnits"
                                name="occupiedUnits"
                                value={formik.values.occupiedUnits}
                                onChange={formik.handleChange}
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.occupiedUnits &&
                                formik.errors.occupiedUnits && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.occupiedUnits}
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2 md:mt-2">
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                No. of move-outs
                            </label>
                            <input
                                type="text"
                                id="noOfMoveOuts"
                                name="noOfMoveOuts"
                                value={formik.values.noOfMoveOuts}
                                onChange={formik.handleChange}
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.noOfMoveOuts &&
                                formik.errors.noOfMoveOuts && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.noOfMoveOuts}
                                    </div>
                                )}
                        </div>
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                No. of approved move-ins
                            </label>
                            <input
                                type="text"
                                id="approvedMoveIns"
                                name="approvedMoveIns"
                                value={formik.values.approvedMoveIns}
                                onChange={formik.handleChange}
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.approvedMoveIns &&
                                formik.errors.approvedMoveIns && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.approvedMoveIns}
                                    </div>
                                )}
                        </div>
                        <div className="w-full mb-2 md:flex-1 md:mb-0">
                            <label className="text-sm text-344054 font-normal mb-1.5 block">
                                No. of Vacant
                            </label>
                            <input
                                type="text"
                                id="vacantUnits"
                                name="vacantUnits"
                                value={formik.values.vacantUnits}
                                onChange={formik.handleChange}
                                readOnly
                                className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                            />
                            {formik.touched.vacantUnits &&
                                formik.errors.vacantUnits && (
                                    <div className="error text-red text-sm font-normal mt-1.5">
                                        {formik.errors.vacantUnits}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Property Applications and Tours
                </div>
                <div className="border-1x border-D0D5DD p-3 mb-5 flex flex-wrap  items-start md:flex-nowrap gap-x-2">
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            No. of Pending Applications
                        </label>
                        <input
                            type="text"
                            id="pendingApplications"
                            name="pendingApplications"
                            value={formik.values.pendingApplications}
                            onChange={formik.handleChange}
                            className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                        />
                        {formik.touched.pendingApplications &&
                            formik.errors.pendingApplications && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.pendingApplications}
                                </div>
                            )}
                    </div>
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            No. of Tours Conducted today
                        </label>
                        <input
                            type="text"
                            id="toursConductedToday"
                            name="toursConductedToday"
                            value={formik.values.toursConductedToday}
                            onChange={formik.handleChange}
                            className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                        />
                        {formik.touched.toursConductedToday &&
                            formik.errors.toursConductedToday && (
                                <div className="error text-red text-sm font-normal mt-1.5">
                                    {formik.errors.toursConductedToday}
                                </div>
                            )}
                    </div>
                </div>
                <div className="text-sm font-semibold text-[#101828] mb-2">
                    Additional Notes
                </div>
                <div className="border-1x border-D0D5DD p-3 mb-5 flex flex-wrap  items-end md:flex-nowrap gap-x-2">
                    <div className="w-full mb-2 md:flex-1 md:mb-0">
                        <label className="text-sm text-344054 font-normal mb-1.5 block">
                            Write any comment you want to share
                        </label>
                        <textarea
                            id="writeComment"
                            name="comments"
                            value={formik.values.comments}
                            onChange={formik.handleChange}
                            className="px-3.5 w-full  py-0 h-24 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none"
                        />
                        {formik.touched.comments && formik.errors.comments && (
                            <div className="error text-red text-sm font-normal mt-1.5">
                                {formik.errors.comments}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap  md:flex-nowrap gap-x-2">
                    <div className="w-full md:flex-1">
                        <button
                            ref={saveAsDraft}
                            className="w-full border-2 border-black font-bold bg-white text-15151C text-lg p-0 h-14"
                            type="button"
                            onClick={() => handleSaveAsDraft(formik.values)}
                        >
                            Save as Draft
                        </button>
                    </div>
                    <div className="w-full mt-2 md:flex-1 md:mt-0">
                        <button
                            ref={buttonDisable}
                            className="w-full border-2 border-black bg-black text-white font-bold text-lg p-0 h-14"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            <ConfirmatioModal
        // report_id={selectedReport_id}
        // property_id={selectedProperty_id}
        reportValues = {reportValues}
        handleAddClick1={handleAddClick}
        userEdit="add"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        />                          
        </div>
    );
};

export default ReportForm;
