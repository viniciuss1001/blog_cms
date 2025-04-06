"use client"

import { Link } from "@/lib/navigation"
import { Layout } from "antd"
import logoImg from '@/assets/images/shortLogo.svg'
import Image from "next/image"
import LocaleDropDown from "./LocaleDropDown"
import ToggleThemeComponent from "./toggle-theme"
import { Blog } from "@prisma/client"
import { useBlogStore } from "@/stores/blogStore"
import { useEffect } from "react"

const { Header, Content } = Layout

type BlogLayoutProps = {
	children: React.ReactNode
	blog: Blog
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, blog }) => {
	const { setBlog } = useBlogStore()

	useEffect(() => {
		setBlog(blog)
	}, [blog])

	return (
		<Layout className="h-screen overflow-hidden">
			<Header className="flex justify-baseline bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-600">
				<div className="flex items-center justify-between container px-8">
					<Link href={`/${blog.slug}`}>
						<Image src={logoImg} alt="CMS | Blog"
							width={150} priority
						/>
					</Link>
				</div>
				<div className="flex items-center gap-8">
					<LocaleDropDown />
					<ToggleThemeComponent />
				</div>

			</Header>
			<Content >
				<div className="size-full flex items-center justify-center overflow-auto container px-8 mx-auto">
					{children}
				</div>
			</Content>
		</Layout>
	)
}

export default BlogLayout