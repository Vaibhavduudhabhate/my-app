'use client'
import Sidebar from "@/partials/Sidebar";
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Divider,
  } from "@chakra-ui/react";
  import { GiHamburgerMenu } from "react-icons/gi";
import MobileNav from "./MobileNav";
  
const Drawerfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Box minH="100vh" bg={useColorModeValue("black.100", "gray.900")}>
        {/* <Sidebar onClose={onClose} display={{ base: 'none', md: 'block' }} /> */}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            {/* <Sidebar onClose={onClose} /> */}
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <div>
          
        </div>
        {/* <MobileNav onOpen={onOpen} /> */}
        <Box ml={{ base: 0, md: 60 }} p="4">
          {/* Content */}
        </Box>
      </Box>
    </div>
  )
}

export default Drawerfile
