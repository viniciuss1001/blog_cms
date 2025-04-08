type Props = {
	children: React.ReactNode
	params: Promise<{
		blog_slug: string
	}>
}

import AdminLayoutComponent from '@/components/layout/Admin-layout'
import { isAuthenticated } from '@/lib/isAuthenticated'
import { getBlog } from '@/server/admin/blogService'
import { SessionProvider } from 'next-auth/react'
import { notFound } from 'next/navigation'
import React from 'react'

const Layout = async ({ children, params }: Props) => {
	const { blog_slug } = await params
	const session = await isAuthenticated()
	const blog = await getBlog({ slug: blog_slug, user: session.user! })

	if (blog.error || !blog.data) return notFound()

	return (
		<SessionProvider>
			<AdminLayoutComponent
				blog={blog.data}
				user={session.user!}
			>
				{children}
			</AdminLayoutComponent>
		</SessionProvider>
	)
}

export default Layout