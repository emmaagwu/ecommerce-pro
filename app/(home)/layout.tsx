"use client"

import { Header } from '@/components/header'
import { useProducts } from '@/hooks/use-products'
import React, {useState} from 'react'

export default function layout({children} : {children: React.ReactNode}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {updateSearch} = useProducts()

  return (
    <div>      
      <Header onSearch={updateSearch} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      {children}
    </div>
  )
}
