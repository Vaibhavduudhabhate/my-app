"use client"
import React from 'react'
import Button from './Button'
import {Plus} from 'feather-icons-react'
import Link from 'next/link'
import useAuthStore from '@/store/AuthStore'

const Comnavbar = ({comHeading,comPara, showLinkButton, givenLink, linkTitle, linkIcon: LinkIcon, iconHeight, iconWidth}) => {
  const {storedRole} = useAuthStore()
  return (
    <div className='text-black py-6 px-8 bg-white flex justify-between'>
      {/* Common navbar render */}
      <div>
        <h2 className='text-lg font-semibold'>{comHeading}</h2>
        <p className='text-sm font-normal'>{comPara}</p>
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
