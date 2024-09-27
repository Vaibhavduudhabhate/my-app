import * as yup from "yup";

/* New report page validation */ 
const defaultValue = {
  userFullName:"",
    // username:"",
    email:"",
    phoneNumber:"",
    role:'',
    propertyAccess:[],
    password:''
    // teams:''
}
const validationSchema = yup.object({
  userFullName:yup
    .string()
    .required("Name Not entered"),
    // username:yup
    // .string()
    // .required("Username Not entered"),
    email:yup
    .string()
    .required("Email Address is required"),
    phoneNumber:yup
    .string()
    .matches(/^\+1 \(\d{3}\) \d{3}-\d{4}$/, "Mobile number must be in the format +1 (496) 652-7018")
    .min(10, "Phone number must be min 10 digits")
    .max(20, "Phone number must be max 15 digits")
    .required("Mobile Number is required"),
    role:yup
    .string()
    .required("Select role is required"),
    propertyAccess:yup.array().min(1, 'Please select at least one Property'),
    password:yup
    .string()
    .min(6, 'Password must be at least 8 characters')
    .required("Password is required")
    // teams:yup
    // .string()
    // .required("Team member is required"),
    // writeComment:yup
    // .string()
    // .required("Comment is required")
  });

export {defaultValue, validationSchema}

