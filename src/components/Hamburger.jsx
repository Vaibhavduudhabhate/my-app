import React from "react";

const Hamburger = ({isOpen,onClick,restClasses,spanRestClass}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col justify-center items-center p-2.5 ${restClasses}`}
    >
      <span
        className={`${spanRestClass} block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                    }`}
      ></span>
      <span
        className={`${spanRestClass} block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
      ></span>
      <span
        className={`${spanRestClass} block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                    }`}
      ></span>
    </button>
  );
};

export default Hamburger;
