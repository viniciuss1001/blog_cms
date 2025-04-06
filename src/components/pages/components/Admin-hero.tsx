"use client"

import { Typography } from "antd"

type AdminHeroPorps = {
   title: string
   description: string
   extra?: React.ReactNode
}

const { Text } = Typography

import React from 'react'

const AdminHero = ({ title, description, extra }: AdminHeroPorps) => {
   return (
      <div className="rounded-md flex items-center gap-6 border-b border-b-slate-200 dark:border-slate-800 py-6 px-8">
         <div className="space-y-1 flex-1/2">
            <Text strong className="text-3xl">
               {title}
            </Text>
            <p className="ml-0.5 font-semibold text-slate-600 dark:text-slate-200">
               {description}
            </p>

         </div>
         <div className="flex items-center gap-4">
            {extra}
         </div>
      </div>
   )
}

export default AdminHero