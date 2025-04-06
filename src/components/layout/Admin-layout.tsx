"use client"

import { Link, useRouter } from "@/lib/navigation"
import { hasPermission } from "@/lib/permissions"
import { getMyBlogs } from "@/server/admin/blogService"
import { useAdminBlogStore } from "@/stores/blogAdminStore"
import { BlogWithUsers } from "@/types/blog"
import { DashboardOutlined, FileTextOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Layout, Menu, Select, Spin } from "antd"
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb"
import { Breadcrumb, MenuProps } from "antd/lib"
import { User } from "next-auth"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { usePathname } from "next/navigation"
import React, { Children, useEffect, useState } from "react"
import logo from '@/assets/images/shortLogo.svg'
import LocaleDropDown from "./LocaleDropDown"
import ToggleThemeComponent from "./toggle-theme"


type AdminLayoutProps = {
	children: React.ReactNode
	blog: BlogWithUsers
	user: User
}

const { Header, Content, Sider } = Layout

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
		router.replace(`/${slug}/${formatedPathname}`)
	}

	const menuItems: MenuProps['items'] = [
		{
			key: '/admin',
			icon: <DashboardOutlined />,
			label: "Dashboard",
			onClick: () => router.push(`${blog.slug}/admin`)
		},
		{
			key: '/admin/posts',
			icon: <FileTextOutlined />,
			label: t('posts'),
			onClick: () => router.push(`${blog.slug}/admin/posts`)
		},
		{
			key: '/admin/users',
			icon: <UserOutlined />,
			label: t('users'),
			disabled: !hasPermission({ blogUser: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] }),
			onClick: () => router.push(`${blog.slug}/admin/users`)
		},
		{
			key: '/admin/settings',
			icon: <SettingOutlined />,
			label: t('settings'),
			disabled: !hasPermission({ blogUser: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] }),
			onClick: () => router.push(`${blog.slug}/admin/settings`)
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
		if ((formatedPathname.includes('/users') || formatedPathname.includes('/settings')) && !hasPermission({ blogUser: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN'] })) {
			router.replace(`/${blog.slug}/admin`)
		} else {
			setRestricted(false)
		}
	}, [blog, formatedPathname])

	return (
		<Layout className="h-screen overflow-hidden">
			<Sider
				trigger={null}
				collapsible collapsed={collapsed}
				className="bg-white dark:bg-slate-950"
			>
				<Link
					href='/'
					className="flex items-center justify-center border-b border-slate-200 dark:border-b-zinc-800 mb-4"
				>
					<Image
						src={logo}
						alt="CMS | BLOG"
						width={20} height={32}
						priority
					/>
				</Link>
				<div className="px-2 pb-4 border-b border-slate-200 dark:border-b-zinc-800">
					<Select
						showSearch
						className="w-full"
						defaultValue={blog.slug}
						onChange={handleChangeBlog}
						loading={loading}
						options={blogs.map(blog => ({
							value: blog.slug,
							label: blog.title
						}))}
					/>
				</div>

				<Menu
					mode="inline"
					defaultSelectedKeys={[formatedPathname]}
					selectedKeys={[formatedPathname]}
					items={menuItems}
					className="h-full border-r-0 bg-white dark:bg-slate-950"
				/>
			</Sider>
			<Layout className="dark:bg-slate-950">
				<Header className="flex justify-baseline items-center p-0 pr-14 gap-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-600">
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
						onClick={handleCollapse}
						className="size-16"
					>

					</Button>

					<div className="flex items-center gap-5">
						<LocaleDropDown />
						<ToggleThemeComponent />
					</div>

				</Header>
				<Content className="px-4 pb-2 flex flex-col overflow-auto">
					<Breadcrumb
						className="my-4"
						items={breadcrumpItems.find(item => item.pathname === formatedPathname)?.items || []}
						itemRender={
							(route) => (
								<Link href={`/${blog.slug}${route.href || ''}`}>
									{route.title}
								</Link>
							)
						}
					/>
					<div className="flex-1 relative rounded-lg bg-white dark:bg-slate-950">
						<Spin
							className="flex items-center justify-center size-full absolute bg-white dark:bg-slate-950"
							spinning={restricted}
							size="large"
						/>
						{!restricted && children}
					</div>

				</Content>
			</Layout>

		</Layout>
	)
}

export default AdminLayoutComponent