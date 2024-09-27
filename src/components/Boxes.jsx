// "use client"
import { Server, Info, ArrowDown, ArrowUp, Flag } from "feather-icons-react";
// import { useEffect, useRef } from "react";
const Boxes = ({
  boxLeftTitle,
  boxLeftIcon: BoxLeftIcon,
  boxValue,
  boxPercentageValue,
  arraowIcon: ArraowIcon,
  ArraowIconColor,
  popoverContent,
  popoverBoxWidth,
  popoverLeftPosition
}) => {
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // const popoverRef = useRef();
  // const handleClickOutside = (event) => {
  //   if (popoverRef.current && !popoverRef.current.contains(event.target)) {
  //     setIsPopoverOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  // console.log("popoverContent", popoverContent);
  return (
    <>
      <div className="p-4 bg-white border-1x border-A4A4A9">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-2">
            <h4 className="text-nowrap text-lg">{boxLeftTitle}</h4>
            <div className="flex justify-end">
              <span className="h-7.5 w-7.5 bg-slate-200 rounded-full flex justify-center items-center">
                <BoxLeftIcon className="w-16.67  rounded-full" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 m-1.5 ">
            <h2 className="text-text-3.5xl font-semibold leading-9.5">
              {boxValue}
            </h2>
            <span className="relative group">
              <Info className="w-4 h-4 text-gray-700 cursor-pointer" />
              <div className={`absolute ${popoverBoxWidth} bg-custom_bg_button text-white bottom-1.5 ${popoverLeftPosition} hidden group-hover:block z-10 mt-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-4`}>
                {popoverContent}
              </div>
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 items-center pt-[10px] border-t-[1px] mt-[12px] border-D0D5DD">
          <ArraowIcon className={`w-4 h-4 mt-0.6 ${ArraowIconColor}`} />
          <h6 className="text-[14px]">{boxPercentageValue}</h6>
          {/* vs */}
          <p className="text-101828 text-[12px]">vs last month</p>
        </div>
      </div>
    </>
  );
};

export default Boxes;
