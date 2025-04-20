"use client"

import { Link } from "@/lib/navigation"
import Image from "next/image"
import LocaleDropDown from "./LocaleDropDown"
import { ModeToggle } from "./theme/theme-mode-toggle"
import logoImg from '@/assets/images/shortLogo.svg'

import { Blog } from "@prisma/client"
import { useBlogStore } from "@/stores/blogStore"
import { useEffect } from "react"

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
		<div className="h-screen overflow-hidden flex flex-col bg-white dark:bg-slate-950">
			<header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-600">
				<div className="container mx-auto px-8 h-16 flex items-center justify-between">
					<Link href={`/${blog.slug}`}>
						<Image
							src={logoImg}
							alt="CMS | Blog"
							width={150}
							priority
						/>
					</Link>
					<div className="flex items-center gap-8">
						<LocaleDropDown />
						<ModeToggle />
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-auto">
				<div className="h-full flex items-center justify-center container mx-auto px-8">
					{children}
				</div>
			</main>
		</div>
	)
}

export default BlogLayout
