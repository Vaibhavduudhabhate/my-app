"use client"
import React from 'react'
import Button from './Button'
import {Plus, Menu} from 'feather-icons-react'
import Link from 'next/link'
import useAuthStore from '@/store/AuthStore'

const Comnavbar = ({comHeading,comPara, showLinkButton, givenLink, linkTitle, linkIcon: LinkIcon, iconHeight, iconWidth}) => {
  const {storedRole} = useAuthStore();
  const handleHamburger = () => {
    alert("")
  }
  return (
    <div className='text-black py-6 px-8 bg-white 2xl:flex xl:flex lg:flex md:grid md:grid-cols-1 md:place-items-center sm:grid sm:grid-cols-1 sm:place-items-center grid grid-cols-1 place-items-center justify-between 2xl:mt-0 xl:mt-0 mt-[42px]'>
      {/* sidebar open close hamburger start */}
      {/* <p className='p-2.5 bg-[#EDF2F7] rounded'>
        <Menu className={"2xl:hidden xl:hidden block"} onClick={() => {handleHamburger()}} />
      </p> */}
      {/* sidebar open close hamburger end */}
      {/* Common navbar render */}
      <div>
        <h2 className='text-lg font-semibold 2xl:text-start xl:text-start lg:text-start md:text-center sm:text-center text-center'>{comHeading}</h2>
        <p className='text-sm font-normal 2xl:text-start xl:text-start lg:text-start md:text-center sm:text-center text-center'>{comPara}</p>
      </div>
    
      {/* { showLinkButton != undefined && (
        <Link className='text-white bg-custom_bg_button py-2.5 px-padding4.5 flex items-center' href={givenLink}>
          {
            LinkIcon && <LinkIcon className={`${iconHeight} ${iconWidth} items-center w-5 h-5`} />
          }
          {linkTitle}
        </Link>
      )
      } */}
      {
   storedRole == 'Admin' && showLinkButton !== undefined && (
    <Link
      className='text-white bg-custom_bg_button py-2.5 px-padding4.5 flex items-center'
      href={givenLink}
    >
      {LinkIcon && <LinkIcon className={`${iconHeight} ${iconWidth} items-center w-5 h-5`} />}
      {linkTitle}
    </Link>
  )
}

    </div>
  )
}

export default Comnavbar
