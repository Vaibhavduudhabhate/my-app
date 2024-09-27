"use client";
import React, { useEffect, useState } from "react";
import { Server, FileText, Layers, User, Bell, Home, Menu ,LogOut} from "feather-icons-react"
import Link from "next/link";
import Button from "@/components/Button";
import useAuthStore from "@/store/AuthStore";
import ConfirmatioModal from "@/components/ConfirmationBox";

export default function Sidebar() {
  const authStore = useAuthStore();
  const [activeMenu, setActiveMenu] = useState("");
  useEffect(() => {
    // Set the active menu based on the current path when the component mounts
    if (typeof window !== "undefined") {
      setActiveMenu(window.location.pathname);
    }
  }, []); 
  const handleMenuClick = (href) => {
    setActiveMenu(href);
  };
  const menus = [
    { name: "Dashboard", href: "/dashboard", icon: Server },
    { name: "Daily Reports", href: "/dashboard/daily-reports", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: Layers },
    { name: "User Management", href: "/dashboard/user-management", icon: User, margin: true },
    { name: "Property Management", href: "/dashboard/property-management", icon: Home },
    { name: "Notifications", href: "/dashboard/notification", icon: Bell },
  ];
  const [open, setOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogoutClicked = () => {
    setIsModalOpen(true)
  }
  const handleLogout = ()=>{
    authStore.setAuth({
      isAuthenticated: false,
      storedToken: null,
      storedUsername: null,
      storedEmail: null,
      storedRole: null,
    });
    setIsModalOpen(false)
  }
  
  return (
    <div
      className={`customScrollBarWidth overflow-auto fixed z-10 left-0 bg-theme_primary_bg h-screen py-9 px-4 ${open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4 flex flex-col justify-between gap-[90px]`}
    >
      <div>
        <div className="py-3 flex justify-end hidden">
          <Menu
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="after:content['*'] after:w-full after:border after:block after:my-4 after:border-484852">
          <img src="/logoHorizontal.png" className="h-56 w-208.04" alt="" />
        </div>
                                                                                                                              <div className="mt-4 flex flex-col gap-2 relative">
          {menus?.map((menu, i) => (
            <React.Fragment key={i}>
              {
                (i == 3 || i == 5) && <div className="after:content['*'] after:w-full after:border after:block after:border-484852"></div>
              }
              <Link
                href={menu?.href}
                key={i}
                className={`group flex items-center text-sm gap-3.5 font-medium text-A4A4A9 hover:text-white rounded-none py-2.5 px-3
                  ${activeMenu === menu.href ? "bg-[#484852] text-white" : "hover:bg-hover_theme_primary_bg"}`}
                  onClick={() => handleMenuClick(menu.href)}
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  // style={{
                  //   transitionDelay: `${i + 3}00ms`,
                  // }}
                  className={`whitespace-pre duration-100 text-lg font-normal ${!open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
              </Link>

            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bottom-0 w-full left-0  ">
      <div className="editprofileSidebar w-full p-3 flex flex-col bg-hover_theme_primary_bg">
        <div className="flex flex-row">
        <div className="imgavtar h-[48px] w-[48px]">
          <img className='rounded-full border-1' src="/Avatardummy.jpeg" alt="Avatar Image" srcSet="" />
        </div>
        <div className="editProfileHeadSidebar ml-2">
          <h1 className="h-[27px] text-base size-5 w-full">{authStore.storedUsername}</h1>
          <p className="h-[20px] text-xs size-2 w-full">{authStore.storedRole}</p>
        </div>
        </div>
        <div className="btnEditProfile mt-4 w-full">
            <Link href='/dashboard/edit-profile' className="w-full text-white py-2.5 px-4.5 bg-custom_bg_button block text-center" 
            >Edit Profile</Link>
        </div>

      </div>
        <div className="logoutBtn mt-[16px]">
          <Button 
              fontSize = 'text-lg'
              width = 'w-full'
              title_color="text-A4A4A9"
              displayButton="true"
              title="Logout"
              bgColor="transparent"
              padding_top_bottom="py-2.5"
              padding_left_right="px-3.5"
               btnIcon={LogOut}
               icontransform = 'rotate-180'
               flexShouldApply='flex'
               border_color={'border-border-A4A4A9'}
               border_width={'border-2'}
               btngap={'gap-[12px]'}
               onClick={handleLogoutClicked}
              />
        </div>

      </div>
      <ConfirmatioModal
        userEdit="logout"
        onLogout={handleLogout}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>

  );
}