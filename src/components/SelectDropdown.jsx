import React from 'react'

export const SelectDropdown = ({mdy}) => {
  return (
    <div className="relative">
        <select className="appearance-none px-[14px] py-[10px] bg-white border-1x border-22222E placeholder-slate-400 focus:outline-none">
            {mdy.map(({ value, label }) => (
                <option value={value} key={value}>{label}</option>
        ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-22222E" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
    </div>
  )
}
