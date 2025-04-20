"use client"

import { Link } from "@/lib/navigation"
import { Layout } from "antd"
import logoImg from '@/assets/images/shortLogo.svg'
import Image from "next/image"
import LocaleDropDown from "./LocaleDropDown"
import { ModeToggle } from "./theme/theme-mode-toggle"

const { Header, Content } = Layout

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="h-screen overflow-hidden flex flex-col bg-background">
			<header className="flex justify-between items-center gap-4 xl:px-40 px-6 h-16 bg-background">
				<Link href='/auth/signin'>
					<Image
						src={logoImg}
						alt="CMS | Blog"
						width={150}
						priority
					/>
				</Link>

				<div className="flex items-center gap-5">
					<LocaleDropDown />
					<ModeToggle />
				</div>

			</header>
			<main className="flex-1 flex items-center justify-center overflow-hidden">
				{children}
			</main>
		</div>
	)
}

export default AuthLayout