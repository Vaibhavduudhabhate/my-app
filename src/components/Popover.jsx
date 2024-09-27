"use client"
const Popover = ({ content, isVisible }) => {
    if (!isVisible) return null;
  
    return (
      <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4">
        {content}
      </div>
    );
  };
  
  export default Popover;
  