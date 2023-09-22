'use client'
import React from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'
import Searchbar from '@/components/portfolio/Searchbar'
export default function StockHeader() {
  return (
    <header className='container flex items-center justify-between px-6 py-2 mx-auto border-b border-black h-14 [&:after]:content-[""]'>
      <GiHamburgerMenu size='1.5rem' />
      <Searchbar />
    </header>
  )
}
