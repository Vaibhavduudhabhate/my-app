"use client"
import React, {useState} from "react"; 
import Datepicker from "react-tailwindcss-datepicker"; 


const DatepickerBox = ({onDateChange}) => {
    const [value, setValue] = useState({ 
        // startDate: new Date(), 
        // endDate: new Date().setMonth(11) 
    }); 
    const handleValueChange = (newValue) => {
        // console.log("newValue:", newValue); 
        if(newValue.startDate == null && newValue.endDate == null){
          setValue(newValue)
          newValue = ""
          // console.log(newValue);
          if (onDateChange) {
            onDateChange(newValue);
          }
          
        }else{
          setValue(newValue)
          if (onDateChange) {
            onDateChange(newValue);
          }
        }
    } 
  return (
    <div className="">
        <Datepicker value={value} onChange={handleValueChange} inputClassName="px-4 min-w-72 h-10 border-1x border-22222E shadow-custom-shadow w-full placeholder:text-22222E focus:outline-none" iconClassName="text-22222E"   />
    </div>
  )
}

export default DatepickerBox