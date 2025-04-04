"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "@/lib/navigation"
import { User } from "next-auth"
import { getLocale } from "next-intl/server"
import { revalidatePath } from "next/cache"


export const getMyBlogs = async () => {
	const user = await auth()

	const blogs = await prisma.blog.findMany({
		where: {
			users: { some: { userId: user?.user?.id } },
			deletedAt: null
		}
	})

	return { data: blogs }
}

type createBlogProps = {
	data: {
		title: string,
		subtitle: string,
		slug: string,
		bgColor: string,
		textColor: string
	}
}

export const createBlog = async ({ data }: createBlogProps) => {
	const user = await auth()

	if (!user) {
		throw new Error("Unauthorized")
	}

	const slugExists = await prisma.blog.findFirst({
		where: {
			slug: data.slug
		}
	})

	if (slugExists) return { error: "SLUG_ALREADY_EXISTS" }

	const blog = await prisma.blog.create({
		data: {
			...data,
			users: {
				create: [
					{ role: "OWNER", userId: user?.user?.id! }
				]
			}
		}
	})

	const currentLocale = await getLocale()

	revalidatePath('/')
	redirect({ href: `/${blog.slug}/admin`, locale: currentLocale })
}

type updateBlogProps = {
	blogId: string
	data: {
		id: string,
		title: string,
		subtitle: string,
		slug: string,
		bgColor: string,
		textColor: string
	}
}

export const updateBlog = async ({ blogId, data }: updateBlogProps) => {
	const blog = await prisma.blog.findFirst({
		where: {
			id: blogId,
			deletedAt: null
		},
		select: {
			slug: true
		}
	})

	const slugExists = await prisma.blog.count({
		where: {
			slug: data.slug
		}
	})

	if (blog?.slug !== data.slug) {
		if (slugExists > 0) return { error: "SLUG_ALREADY_EXISTS" }
	}

	await prisma.blog.update({
		where: {
			id: blogId
		},
		data
	})

	const currentLocale = await getLocale()

	revalidatePath('/admin/settings')

	if (blog?.slug !== data.slug) {
		redirect({ href: `${data.slug}/admin/setting`, locale: currentLocale })
	}
}

type getBlogProps = {
	slug: string,
	user: User
}

export const getBlog = async ({ user, slug }: getBlogProps) => {
	const blog = await prisma.blog.findFirst({
		where: {
			slug,
			deletedAt: null
		},
		include: {
			users: {
				where: {
					userId: user?.id
				}
			}
		}
	})

	const blogBelongsToUser = blog?.users.some(data => data.userId === user.id)

	if (!blog || !blogBelongsToUser) return { error: "BLOG_NOT_FOUND" }

	return { data: blog }
}

type deleteBlogProps = {
	blogId: string
}

export const deleteBlog = async ({ blogId }: deleteBlogProps) => {
	await prisma.blog.update({
		where: {
			id: blogId
		}, 
		data: {
			deletedAt: new Date()
		}
	})

	
}