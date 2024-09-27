"use client"
import { useFormik } from 'formik'
import * as yup from "yup";
import { defaultValue, validationSchema } from '@/validation/reportValidation';
import { useParams } from 'next/navigation'
import { useEffect } from 'react';
import Router from 'next/navigation';
import { useRouter } from 'next/navigation';

const NewReportForm = ({propertyData, currencyData, editPropertyData}) => {
    // console.log("editPropertyData");
    // console.log(editPropertyData);
    const {slug} = useParams();
    // console.log("id...");
    // console.log(slug);

    const router = useRouter();

    /** Save As dtaft start**/ 
    const handleSaveAsDraft = async(values) => {
        // const updatedValues = { ...values, status: 'draft' };
        // console.log('Saving as draft:', updatedValues);
        try {
            const updatedValues = { ...values, status: 'draft' };
            const response = await fetch('/api/create-property-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedValues)
            });
            console.log("response...", response);
            const data = await response.json();
      console.log("response data:", data);
    
            // Reload the page or handle the response as needed
            // window.location.reload();
        } catch (error) {
            console.error('Error creating property report:', error);
        }
    }
     /** Save As dtaft end**/ 

    useEffect(() => {
        try{
            if(editPropertyData){
                console.log("editPropertyData");
    console.log(editPropertyData);
                formik.setFieldValue('property_id', editPropertyData.property_id);
                formik.setFieldValue('propertyDate', editPropertyData.propertyDate);
                formik.setFieldValue('totalUnits', editPropertyData.totalUnits);
                formik.setFieldValue('currency', editPropertyData.currency);
                formik.setFieldValue('rentCollected', editPropertyData.rentCollected);
                formik.setFieldValue('otherIncome', editPropertyData.otherIncome);
                formik.setFieldValue('totalCollection', editPropertyData.totalCollection);
                formik.setFieldValue('grossCollection', editPropertyData.grossCollection);
                formik.setFieldValue('currentMonthDeliquency', editPropertyData.currentMonthDeliquency);
                formik.setFieldValue('priorMonthDeliquency', editPropertyData.priorMonthDeliquency);
                formik.setFieldValue('occupiedUnits', editPropertyData.occupiedUnits);
                formik.setFieldValue('noOfMoveOuts', editPropertyData.noOfMoveOuts);
                formik.setFieldValue('approvedMoveIns', editPropertyData.approvedMoveIns);
                formik.setFieldValue('vacantUnits', editPropertyData.vacantUnits);
                formik.setFieldValue('pendingApplications', editPropertyData.pendingApplications);
                formik.setFieldValue('toursConductedToday', editPropertyData.toursConductedToday);
                formik.setFieldValue('comments', editPropertyData.comments);
              } 
        }catch(err){
            console.error('Error deleting property:', err);
        }
    },[editPropertyData])

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: async function (values) {
          console.log("values....");
          console.log(values);

          const editedFields = Object.keys(values).filter(
            (key) => values[key] !== editPropertyData[key]
          );
          const updated_item = {};
          editedFields.forEach((field) => {
            updated_item[field] = values[field];
          });

          console.log("updated_item");
          console.log(updated_item);
        try{
            const response = await fetch(`/api/daily-report-edit/?report_id=${slug}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({report_id: slug, updated_item}),
            });
          }
          catch(error){
            // alert("error",error);
            // alert("Error deleting property");
          }
        }
      })
  return (
    <div>
        <form onSubmit={formik.handleSubmit}>
        <div className="border-b-1x border-D0D5DD pb-2 mb-5 flex items-center flex-wrap  md:flex-nowrap gap-x-2">
            <div className="w-full md:w-3/4">
            <h4 className="text-base font-semibold text-101828">Enter property data</h4>
            <p className="text-sm font-normal text-344054">provide data of your property collection</p>
            </div>
            <div className="w-full md:w-1/4 text-right">
            <button className="text-base font-semibold text-D92D20" type="reset" onClick={() => formik.resetForm()}>Clear All</button>
            </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Property Information</div>
        <div className="border-1x border-D0D5DD p-3 flex flex-wrap  md:flex-nowrap gap-x-2 mb-5">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
            <label className="text-sm text-344054 font-normal mb-1.5 block">Select Property</label>
            <div className="relative">
                    <select id="property_id" name="property_id" value={formik.values.property_id}  onChange={formik.handleChange} className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none">
                        <option selected>Select Property</option>
                        {propertyData && propertyData.length > 0 && propertyData.map((item)=>(
                        <option value={item.property_id} key={item.property_id}>{item.property_name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                {formik.touched.property_id && formik.errors.property_id && (
                    <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.property_id}</div>
                )}
            </div>
            <div className="w-full md:flex-1">
            <label className="text-sm text-344054 font-normal mb-1.5 block">Select Date</label>
            <input type="date" name="propertyDate" id="propertyDate" value={formik.values.propertyDate} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
            {formik.touched.propertyDate && formik.errors.propertyDate && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.propertyDate}</div>
            )}
            </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Collection Data of 25 Jun 2024</div>
        <div className="border-1x border-D0D5DD p-3 mb-5">
            <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Rent Collected</label>
                <div className="flex w-full">
                <div className="relative w-75">
                    <select id="rentCurrency" name="currency" value={formik.values.currency} onChange={formik.handleChange}  className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none">
                        {currencyData.map((currency, index) => (
                        <option key={index} value={currency.symbol}>
                            {currency.code}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6.5 6.5L11.5 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                </div>
                <div className="w-c-width">
                    <input type="text" name="rentCollected" id="rentCollected" value={formik.values.rentCollected} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                    </div>
                </div>
                {formik.touched.rentCollected && formik.errors.rentCollected && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.rentCollected}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Other Income</label>
                <div className="flex w-full">
                <div className="relative w-75">
                    <select id="otherIncomeCurrency" name="currency" value={formik.values.currency} onChange={formik.handleChange} className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none">
                        {currencyData.map((currency, index) => (
                        <option key={index} value={currency.symbol}>
                            {currency.code}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6.5 6.5L11.5 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                </div>
                <div className="w-c-width">
                    <input type="text" id="otherIncome" name="otherIncome"  value={formik.values.otherIncome} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                </div>
                </div>
                {formik.touched.otherIncome && formik.errors.otherIncome && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.otherIncome}</div>
                )}
            </div>
            <div className="h-h44 flex items-center w-full text-center md:w-auto md:mt-6">
                <svg  width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.272727 1.88636V0.659091H7.27273V1.88636H0.272727ZM0.272727 5.25V4.02273H7.27273V5.25H0.272727Z" fill="#101828"/>
                </svg>
            </div>
            <div className="w-full md:flex-1">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Total Collection (Rent Collected + Other Income)</label>
                <input type="text" name="totalCollection" id="totalCollection" value={formik.values.totalCollection} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.totalCollection && formik.errors.totalCollection && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.totalCollection}</div>
                )}
            </div>
            </div>
            <div className="w-full mt-2 md:flex-1">
            <label className="text-sm text-344054 font-normal mb-1.5 block">Total Gross collection till today (Sum of total collection of all months)</label>
            <input type="text" name="grossCollection" id="grossCollection" value={formik.values.grossCollection} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
            {formik.touched.grossCollection && formik.errors.grossCollection && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.grossCollection}</div>
                )}
        </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Delinquency Data</div>
        <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2 border-1x border-D0D5DD p-3 mb-5">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Current month Delinquency</label>
                <div className="flex w-full">
                <div className="relative w-75">
                    <select id="currentMonthDCurrency" name="currency" value={formik.values.currency} onChange={formik.handleChange} className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none">
                        {currencyData.map((currency, index) => (
                        <option key={index} value={currency.symbol}>
                            {currency.code}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6.5 6.5L11.5 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                </div>
                <div className="w-c-width">
                    <input type="text" id="currentMonthDeliquency" name="currentMonthDeliquency" value={formik.values.currentMonthDeliquency} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                </div>
                </div>
                {formik.touched.currentMonthDeliquency && formik.errors.currentMonthDeliquency && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.currentMonthDeliquency}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Prior month Delinquency</label>
                <div className="flex w-full">
                <div className="relative w-75">
                    <select id="PriorMonthCurrency" name="currency" value={formik.values.currency} onChange={formik.handleChange}  className="appearance-none pl-3.5 pr-7 py-0 h-h44 bg-white border-1x border-D0D5DD border-r-0 shadow-custom-shadow w-full text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none">
                        {currencyData.map((currency, index) => (
                        <option key={index} value={currency.symbol}>
                            {currency.code}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6.5 6.5L11.5 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                </div>
                <div className="w-c-width">
                    <input type="text" id="priorMonthDeliquency" name="priorMonthDeliquency" value={formik.values.priorMonthDeliquency} onChange={formik.handleChange}  className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-l-0 border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                </div>
                </div>
                {formik.touched.priorMonthDeliquency && formik.errors.priorMonthDeliquency && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.priorMonthDeliquency}</div>
                )}
            </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Occupancy Data</div>
        <div className="border-1x border-D0D5DD p-3 mb-5">
            <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Total no. of Units</label>
                <input type="text" id="totalUnits" name="totalUnits" value={formik.values.totalUnits} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.totalUnits && formik.errors.totalUnits && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.totalUnits}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of Occupied</label>
                <input type="text" id="occupiedUnits" name="occupiedUnits"  value={formik.values.occupiedUnits} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.occupiedUnits && formik.errors.occupiedUnits && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.occupiedUnits}</div>
                )}
            </div>
            </div>
            <div className="flex flex-wrap  items-start md:flex-nowrap gap-x-2 md:mt-2">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of move-outs</label>
                <input type="text" id="noOfMoveOuts" name="noOfMoveOuts"  value={formik.values.noOfMoveOuts} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.noOfMoveOuts && formik.errors.noOfMoveOuts && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.noOfMoveOuts}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of approved move-ins</label>
                <input type="text" id="approvedMoveIns" name="approvedMoveIns"  value={formik.values.approvedMoveIns} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.approvedMoveIns && formik.errors.approvedMoveIns && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.approvedMoveIns}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of Vacant</label>
                <input type="text" id="vacantUnits" name="vacantUnits"  value={formik.values.vacantUnits} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.vacantUnits && formik.errors.vacantUnits && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.vacantUnits}</div>
                )}
            </div>
            </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Property Applications and Tours</div>
        <div className="border-1x border-D0D5DD p-3 mb-5 flex flex-wrap  items-start md:flex-nowrap gap-x-2">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of Pending Applications</label>
                <input type="text" id="pendingApplications" name="pendingApplications"  value={formik.values.pendingApplications} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.pendingApplications && formik.errors.pendingApplications && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.pendingApplications}</div>
                )}
            </div>
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">No. of Tours Conducted today</label>
                <input type="text" id="toursConductedToday" name="toursConductedToday"  value={formik.values.toursConductedToday} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-h44 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.toursConductedToday && formik.errors.toursConductedToday && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.toursConductedToday}</div>
                )}
            </div>
        </div>
        <div className="text-sm font-semibold text-[#101828] mb-2">Additional Notes</div>
        <div className="border-1x border-D0D5DD p-3 mb-5 flex flex-wrap  items-end md:flex-nowrap gap-x-2">
            <div className="w-full mb-2 md:flex-1 md:mb-0">
                <label className="text-sm text-344054 font-normal mb-1.5 block">Write any comment you want to share</label>
                <textarea id="writeComment" name="comments"  value={formik.values.comments} onChange={formik.handleChange} className="px-3.5 w-full  py-0 h-24 bg-white border-1x border-D0D5DD shadow-custom-shadow text-base font-normal text-101828 placeholder-shown:text-101828 focus:outline-none" />
                {formik.touched.comments && formik.errors.comments && (
                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.comments}</div>
                )}
            </div>
        </div>
        <div className="flex flex-wrap  md:flex-nowrap gap-x-2">
            <div className="w-full md:flex-1">
                <button className='w-full border-2 border-black font-bold bg-white text-15151C text-lg p-0 h-14' type="button" onClick={()=>{router.push("/dashboard/daily-reports")}}>Cancel</button>
            </div>
            <div className="w-full mt-2 md:flex-1 md:mt-0">
                <button className='w-full border-2 border-black bg-black text-white font-bold text-lg p-0 h-14' type="submit">Submit</button>
            </div>
        </div>
        </form>
    </div>
  )
}

export default NewReportForm