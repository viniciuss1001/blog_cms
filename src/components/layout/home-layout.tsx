"use client"

import { Link } from "@/lib/navigation"
import { Layout } from "antd"
import logoImg from '@/assets/images/shortLogo.svg'
import Image from "next/image"
import LocaleDropDown from "./LocaleDropDown"
import ToggleThemeComponent from "./toggle-theme"

const { Header, Content } = Layout

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Layout className="h-screen overflow-hidden">
			<Layout className="dark:bg-slate-900">
				<Header className="flex justify-baseline items-center gap-4 xl:px-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-600">
					<Link href='/' >
						<Image src={logoImg} alt="CMS | Blog"
						width={150} priority
						/>
					</Link>

					<div className="flex items-center gap-5">
						<LocaleDropDown />
						<ToggleThemeComponent />
					</div>

				</Header>
				<Content className="flex items-center justify-center overflow-auto bg-white dark:bg-slate-950">
						{children}
				</Content>
			</Layout>
		</Layout>
	)
}

export default HomeLayout