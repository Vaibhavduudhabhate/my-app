"use client";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
import { FiLayers, FiUser } from "react-icons/fi";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";
const LinkItems = [
  { name: "Dashboard", href: "/dashboard" ,icon: MdSpaceDashboard },
  { name: "Daily Reports", href: "/daily-reports" ,icon: LuFileSpreadsheet },
  { name: "Analytics", href: "/analytics" ,icon: FiLayers },
  { name: "User Management", href: "/user-management" ,icon: FiUser },
  { name: "Property management", href: "/property-management" ,icon: PiBuildingOfficeBold },
  { name: "Notifications", href: "/notifications" ,icon: IoMdNotificationsOutline },
];
const NavItem = ({ href,icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        role="group"
        cursor="pointer"
        {...rest}>
        {icon && (
          <Icon
            // mr="4"
            fontSize="24"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};
const Mapfile = () => {
  return (
    <>
      {LinkItems.map((link) => (
        // console.log(link)
        <NavItem
          // href={link.href}
          key={link.name}
          href={link.href}
          icon={link.icon}
          className="text-A4A4A9 text-lg font-normal hover:text-white hover:bg-transparent py-2.5 px-3 gap-3 hover:bg-dashboardHoverBg"
        >
          {link.name}
        </NavItem>
      ))}
    </>
  );
};

export default Mapfile;
