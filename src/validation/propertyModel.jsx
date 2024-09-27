import * as yup from "yup";

/* New report page validation */
const propertyDefaultValue = {
  property_name: "",
  postalCode: "",
  state: "",
  city: "",
  location: "",
  total_units: "",
  propertyMobileNumber: "",
  propertyEmail: "",
  propertyWebsite: "",
  description: "",
};
const propertyValidationSchema = yup.object({
  property_name: yup.string().required("Property name is required"),
  postalCode: yup.string().required("Postal code is required"),
  state: yup.string().required("Please select state"),
  city: yup.string().required("Please select city"),
  location: yup.string().required("Location is required"),
  total_units: yup
    .string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Please enter a Valid Unit"
    )
    .required("Total unit is required"),
  propertyMobileNumber: yup
    .string()
    .matches(/^\+1 \(\d{3}\) \d{3}-\d{4}$/, "Mobile number must be in the format +1 (496) 652-7018")
    .min(10, "Phone number must be min 10 digits")
    .max(20, "Phone number must be max 20 digits")
    .required("Phone number is required"),
  propertyEmail: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  propertyWebsite: yup.string().required("Property website is required"),
  description: yup.string().required("Comment is required"),
});

export { propertyDefaultValue, propertyValidationSchema };

// contact_number: Yup.string()
//   .matches(
//     /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
//       "Please enter a valid mobile number with only numeric digits"
//       )
//       .min(10, "Phone number must be at least 10 characters")
//       .max(10, "Phone number must be at least 10 characters")
//       .required("Phone number is required"),
