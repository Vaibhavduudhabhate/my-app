import * as yup from "yup";

/* Edit Profile page validation */ 
const defaultValue = {
    userFullName:"",
    email:"",
    phoneNumber:"",
}
const validationSchema = yup.object({
    userFullName:yup
    .string()
    .required("Name Not entered"),  
    email:yup
    .string()
    .required("Email Address is required"),
    phoneNumber:yup
    .string()
    .matches(/^\+1 \(\d{3}\) \d{3}-\d{4}$/, "Mobile number must be in the format +1 (496) 652-7018")
    .min(10, "Phone number must be min 10 digits")
    .max(20, "Phone number must be max 20 digits")
    .required("Mobile Number is required"),
  });

const resetDefaultValue = {
    old_password:"",
    new_password:"",
    confirmPassword:"",
}
const resetValidationSchema = yup.object({
    old_password: yup.string()
    // .min(8, 'Password must be at least 8 characters')
    .required('Current Password is required'),
    new_password: yup.string()
    // .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
}); 
export {defaultValue, validationSchema, resetDefaultValue, resetValidationSchema}

