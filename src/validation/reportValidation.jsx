import * as yup from "yup";

/* New report page validation */ 
const defaultValue = {
    property_id:"",
    propertyDate:"",
    currency:"USD",
    rentCollected:"",
    otherIncome:"",
    totalCollection:"",
    grossCollection:"",
    currentMonthDeliquency:"",
    priorMonthDeliquency:"",
    totalUnits:"",
    occupiedUnits:"",
    noOfMoveOuts:"",
    approvedMoveIns:"",
    vacantUnits:"",
    pendingApplications:"",
    toursConductedToday:"",
    status:"",
    comments:""
  }
  const validationSchema = yup.object({
    property_id:yup
    .string()
    .required("Please select property"),
    propertyDate:yup
    .date()
    .required('Please select date'),
    rentCollected:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Rent collected must be a valid number")
    .required("Rent collected is required"),
    otherIncome:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Othe income must be a valid number")
    .required("Other income is required"),
    totalCollection:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Total collection must be a valid number")
    .required("Total collection is required"),
    grossCollection:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Total gross collection must be a valid number")
    .required("Total gross collection is required"),
    currentMonthDeliquency:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Current month delinquency must be a valid number")
    .required("Current month Delinquency is required"),
    priorMonthDeliquency:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Prior month delinquency must be a valid number")
    .required("Prior month Delinquency is required"),
    totalUnits:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Total units must be a valid number")
    .required("Total no. of units is required"),
    occupiedUnits:yup
    .string()
    .matches(/^\d*\.?\d+$/, "No. of occupied must be a valid number")
    .required("No. of Occupied is required"),
    noOfMoveOuts:yup
    .string()
    .matches(/^\d*\.?\d+$/, "No. of move-outs must be a valid number")
    .required("No. of move-outs is required"),
    approvedMoveIns:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Approved move-ins must be a valid number")
    .required("No. of approved move-ins is required"),
    vacantUnits:yup
    .string()
    .min(0, 'Value cannot be negative')
    .matches(/^\d*\.?\d+$/, "No. of vacant must be a valid number")
    .required("No. of Vacant is required"),
    pendingApplications:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Pending applications must be a valid number")
    .required("No. of Pending Applications is required"),
    toursConductedToday:yup
    .string()
    .matches(/^\d*\.?\d+$/, "Tours conducted must be a valid number")
    .required("No. of Tours Conducted today is required"),
    // writeComment:yup
    // .string()
    // .required("Comment is required")
  });

export {defaultValue, validationSchema}