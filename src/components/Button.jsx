"use client"

import { useState } from "react";
const Button = ({displayButton,title, bgColor, width, padding_top_bottom, padding_left_right, height, border_width, border_color, title_color, btnIcon: BtnIcon, flexShouldApply, iconWidth, iconHeight,icontransform ,fontSize,btngap,font_weight,bghover,textHover ,margin_left, onClick, btnType, disabled = false}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
    {displayButton != undefined && (
      <button type={btnType} disabled={disabled} className={`${bgColor} ${width} ${padding_top_bottom} ${padding_left_right} ${height} ${border_width} ${border_color} ${title_color} ${flexShouldApply} ${fontSize} ${btngap} ${font_weight} ${margin_left} ${bghover} ${textHover}`} onClick={onClick} >
        {
          BtnIcon && <BtnIcon className={`${iconHeight} ${iconWidth} ${icontransform} items-center`} />
        }
        {title}
      </button>
    )}
    </>
  )
}

export default Button