"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getBlogUser } from "./blogUserService"
import { revalidatePath } from "next/cache"

export const getBlogPosts = async ({ blogSlug }: { blogSlug: string }) => {
	const session = await auth()

	const user = session?.user

	if (!user) return { error: "Unauthorized" }

	const blog = await prisma.blog.findUnique({
		where: {
			slug: blogSlug
		},
		select: {
			id: true
		}
	})

	const blogUser = await getBlogUser({
		userId: user.id!,
		blogId: blog?.id!
	})

	let where: Record<string, any> = {
		blog: { slug: blogSlug },
		deletedAt: null
	}

	if (blogUser.data?.role === 'AUTHOR') {
		where = {
			...where,
			userId: user.id
		}
	}
	const blogPosts = await prisma.post.findMany({
		where,
		include: {
			user: true
		}
	})

	return { data: blogPosts }
}

type createBlogPostProps = {
	data: {
		title: string
		subtitle?: string
		slug: string
		body: string
		blogId: string
	}
}

export const createBlogPost = async ({ data }: createBlogPostProps) => {
	const session = await auth()

	const user = session?.user

	if (!user) return { error: "Unauthorized" }

	const postExists = await prisma.post.count({
		where: {
			slug: data.slug
		}
	})
	if (postExists) return { error: "POST_ALREADY_EXISTS" }

	await prisma.post.create({
		data: {
			...data,
			subtitle: data.subtitle ?? "",
			userId: user.id!
		}
	})

	revalidatePath("/admin/posts")
}

type updateBlogPostProps = {
	postId: string
	data: {
		title: string
		subtitle?: string
		slug: string
		body: string
	}

}

export const updateBlogPost = async ({ postId, data }: updateBlogPostProps) => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		}
	})

	if (post?.slug !== data.slug) {
		if (await prisma.post.count({
			where: {
				slug: data.slug
			}
		}) > 0) {
			return { error: "POST_ALREADY_EXISTS" }
		}
	}

	await prisma.post.update({
		where: {
			id: postId
		},
		data
	})

	revalidatePath("/admin/posts")
}

export const deleteBlogPost = async ({ postId }: { postId: string }) => {
	await prisma.post.update({
		where: {
			id: postId
		},
		data: {
			deletedAt: new Date()
		}
	})

	revalidatePath("/admin/posts")
}