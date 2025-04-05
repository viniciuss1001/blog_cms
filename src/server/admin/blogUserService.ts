"use server"

import { prisma } from "@/lib/db"
import { BlogUser } from "@prisma/client"
import { revalidatePath } from "next/cache"

type getBlogUsersProps = {
	blogSlug: string
}

export const getBlogUsers = async ({ blogSlug }: getBlogUsersProps) => {

	const users = await prisma.blogUser.findMany({
		where: {
			blog: {
				slug: blogSlug
			}
		},
		include: {
			user: true
		}
	})

	return { data: users }
}

type getBlogUser = {
	userId: string
	blogId: string
}

export const getBlogUser = async ({ blogId, userId }: getBlogUser) => {
	const user = await prisma.blogUser.findFirst({
		where: {
			userId,
			blogId
		},
		include: {
			user: true
		}
	})

	return { data: user }
}

type createBlogUserProps = {
	data: {
		email: string
		blogId: string
		role: BlogUser['role']
	}
}

export const createBlogUser = async ({ data }: createBlogUserProps) => {
	const user = await prisma.user.findUnique({
		where: {
			email: data.email
		}
	})

	if (!user) return { error: "USER_NOT_FOUND" }

	const blogUserExists = await prisma.blogUser.count({
		where: {
			blogId: data.blogId,
			userId: user.id
		}
	})

	if (blogUserExists > 0) return { error: "USER_ALREADY_IN_BLOG" }

	await prisma.blogUser.create({
		data: {
			blogId: data.blogId,
			role: data.role,
			userId: user.id
		}
	})

	revalidatePath("/admin/users")
}

type updateBlugUserRoleProps = {
	blogUserId: string
	data: {
		role: BlogUser['role']
	}
}

export const updateBlugUserRole = async ({ blogUserId, data }: updateBlugUserRoleProps) => {
	await prisma.blogUser.update({
		where: {
			id: blogUserId
		},
		data: {
			role: data.role
		}
	})

	revalidatePath('/admin/users')

}

type deleteBlogUserProps = {
	blogUserId: string
}

export const deleteBlogUser = async ({ blogUserId }: deleteBlogUserProps) => {
	await prisma.blogUser.delete({
		where: {
			id: blogUserId
		}
	})

	revalidatePath('/admin/users')
}