"use client"

import { Link } from "@/lib/navigation"
import logoImg from '@/assets/images/shortLogo.svg'
import Image from "next/image"
import LocaleDropDown from "./LocaleDropDown"
import { ModeToggle } from "./theme/theme-mode-toggle"

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="h-screen flex flex-col overflow-hidden bg-white">
			<header className="flex justify-between items-center gap-4 px-6 xl:px-40 h-16 border border-b border-slate-200">
			<Link href='/'>
			<Image 
			src={logoImg}
			alt="BLOG | ADMIN"
			width={150} priority
			/>
			</Link>
			<div className="flex items-center gap-5">
				<LocaleDropDown />
				<ModeToggle />
			</div>
			</header>
		</div>
	)
}

export default HomeLayout