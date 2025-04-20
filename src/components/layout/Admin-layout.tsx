"use client"

import { Link, useRouter } from "@/lib/navigation"
import { hasPermission } from "@/lib/permissions"
import { getMyBlogs } from "@/server/admin/blogService"
import { useAdminBlogStore } from "@/stores/blogAdminStore"
import { BlogWithUsers } from "@/types/blog"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb"
import { User } from "next-auth"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import logo from '@/assets/images/shortLogo.svg'
import { Skeleton } from "../ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FileText, LayoutDashboard, Settings, User as IconUser, MenuIcon } from "lucide-react"
import { Button } from "../ui/button"
import LocaleDropDown from "./LocaleDropDown"
import { ModeToggle } from "./theme/theme-mode-toggle"


type AdminLayoutProps = {
	children: React.ReactNode
	blog: BlogWithUsers
	user: User
}

const AdminLayoutComponent = ({ children, blog, user }: AdminLayoutProps) => {
	const [collapsed, setCollapsed] = useState(false)
	const [restricted, setRestricted] = useState(true)
	const [loading, setLoading] = useState(true)

	const router = useRouter()
	const pathname = usePathname()
	const t = useTranslations('Layout')
	const { blogs, setBlog, setBlogSelected } = useAdminBlogStore()

	const handleCollapse = () => setCollapsed(!collapsed)

	const formatedPathname = '/' + pathname.split('/').slice(2).join('/')

	const handleChangeBlog = (slug: string) => {
		router.replace(`/${locale}/${slug}/${formatedPathname}`)
	}
	const locale = useLocale()
	const menuItems = [
		{
			key: '/admin',
			icon: <LayoutDashboard className="w-4 h-4" />,
			label: "Dashboard",
			href: `/${blog.slug}/admin`,
			disabled: false,
		},
		{
			key: '/admin/posts',
			icon: <FileText className="w-4 h-4" />,
			label: t('posts'),
			href: `/${blog.slug}/admin/posts`,
			disabled: false,
		},
		{
			key: '/admin/users',
			icon: <IconUser className="w-4 h-4" />,
			label: t('users'),
			href: `/${blog.slug}/admin/users`,
			disabled: !hasPermission({ blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] }),
		},
		{
			key: '/admin/settings',
			icon: <Settings className="w-4 h-4" />,
			label: t('settings'),
			href: `/${blog.slug}/admin/settings`,
			disabled: !hasPermission({ blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] }),
		}
	]

	const breadcrumpItems: { pathname: string, items: BreadcrumbItemType[] }[] = [
		{
			pathname: '/admin',
			items: [
				{
					title: 'Dashboard',
					href: '/admin'
				}
			]
		},
		{
			pathname: '/admin/users',
			items: [
				{
					title: 'Dashboard',
					href: '/admin'
				},
				{
					title: t('users'),
					href: '/admin/users'
				}
			]
		},
		{
			pathname: '/admin/settings',
			items: [
				{
					title: 'Dashboard',
					href: '/admin'
				},
				{
					title: t('settings'),
					href: '/admin/settings'
				}
			]
		}
	]

	useEffect(() => {
		//set blog selected
		setBlogSelected(blog)

		//getting blogs
		const handleGetBlogs = async () => {
			setLoading(true)
			const blog = await getMyBlogs()
			setLoading(false)

			setBlog(blog.data)

		}

		handleGetBlogs()
	}, [blog])

	useEffect(() => {
		//check if user has permission to access the page
		if ((formatedPathname.includes('/users') || formatedPathname.includes('/settings')) && !hasPermission({ blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] })) {
			router.replace(`/${blog.slug}/admin`)
		} else {
			setRestricted(false)
		}
	}, [blog, formatedPathname])


	return (
		<div className="flex h-screen overflow-hidden">
			{/* sidebar */}
			<aside className={`bg-background border-r transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
				<div className="flex justify-center items-center border-b">
					<Link href="/">
						<Image src={logo} alt="CMS | BLOG" width={collapsed ? 24 : 120} height={32} priority />
					</Link>
				</div>
				<div className="px-2 pb-4 border-b">
					{loading ? (
						<Skeleton className="w-full h-19" />
					) : (
						<Select defaultValue={blog.slug} onValueChange={handleChangeBlog}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecione o Blog." />
							</SelectTrigger>
							<SelectContent>
								{blogs.map(blog => (
									<SelectItem key={blog.slug} value={blog.slug}>
										{blog.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>

				<nav className="mt-4 space-y-1 px-2">
					{menuItems.map((item) => (
						<Link key={item?.key}
							href={item?.key as string}
							className="block px-3 rounded-md hover:bg-slate-100 transition"
						>
							{item.icon}
							{!collapsed && <span>{item.label}</span>}
						</Link>
					))}
				</nav>

			</aside>

			<div className=" flex-1 flex flex-col">
				{/* {header} */}
				<header className="flex justify-between items-center h-16 px-6 bg-background ">
					<Button variant='ghost' size='icon' onClick={handleCollapse}>
						<MenuIcon className="size-5" />
					</Button>
					<div className="flex items-center gap-5">
						<LocaleDropDown />
						<ModeToggle />
					</div>
				</header>
				{/* {content} */}
				<main className="flex-1 overflow-auto px-6 py-4">
					<div className="text-sm text-muted-foreground mb-4 flex gap-2 flex-wrap">
						{(breadcrumpItems.find(item => item.pathname === formatedPathname)?.items || []).map((route, idx) => (
							<div key={idx} className="flex items-center gap-1">
								{idx > 0 && <span>/</span>}
								<Link href={`/${blog.slug}${route.href || ''}`} className="hover:underline">
									{route.title}
								</Link>
							</div>
						))}
					</div>

					<div className="relative bg-background rounded-lg min-h-[300px]">
						{restricted && (
							<div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
								<Skeleton className="w-10 h-10 rounded-full" />
							</div>
						)}
						{!restricted && children}
					</div>

				</main>
			</div>

		</div>
	)
}

export default AdminLayoutComponent