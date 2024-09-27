import * as yup from "yup";

/* New report page validation */
const loginDefaultValue = {
  email: "",
  password: ""
};
const loginValidationSchema = yup.object({
    email: yup.string()
    .email('Invalid email address') // Check if email is valid
    .required('Email is required'),
    password: yup.string()
    // .min(8, 'Password must be at least 8 characters')
    // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9]/, 'Password must contain at least one number')
    // .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'), 
});

export { loginDefaultValue, loginValidationSchema };

// contact_number: Yup.string()
//   .matches(
//     /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
//       "Please enter a valid mobile number with only numeric digits"
//       )
//       .min(10, "Phone number must be at least 10 characters")
//       .max(10, "Phone number must be at least 10 characters")
//       .required("Phone number is required"),
