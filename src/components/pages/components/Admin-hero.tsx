"use client"


type AdminHeroPorps = {
   title: string
   description: string
   extra?: React.ReactNode
}


import React from 'react'

const AdminHero = ({ title, description, extra }: AdminHeroPorps) => {
   return (
      <div className="rounded-md flex items-center gap-6 border-b border-b-slate-200 dark:border-slate-800 py-6 px-8">
         <div className="space-y-1 flex-1/2">
            <h2  className="text-3xl font-bold">
               {title}
            </h2>
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