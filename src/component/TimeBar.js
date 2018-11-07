import React from 'react'

export default function TimeBar({ ...rest }) {
  return (
    <rect x='0' y='0' width='86400' height='2320' 
      fillOpacity='.16' rx='250' ry='250' {...rest} />
  )
}