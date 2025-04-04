"use server"
import { prisma } from "@/lib/db"

type getBlogProps = {
	slug: string
}

export const getBlog = async ({ slug }: getBlogProps) => {
	const blog = await prisma.blog.findFirst({
		where: {
			slug: slug,
			deletedAt: null
		}
	})

	return { data: blog }
}
type getBlogPostsProps = {
	blogId: string
}

export const getBlogPosts = async ({ blogId }: getBlogPostsProps) => {
	const posts = await prisma.post.findMany({
		where: {
			blogId, deletedAt: null
		}
	})

	return { data: posts }
}

type getBlogPostProps = {
	blogSlug: string
	postSlug: string
}

export const getBlogPost = async ({ blogSlug, postSlug }: getBlogPostProps) => {
	const blog = await getBlog({ slug: blogSlug })

	if (!blog.data) return { error: "BLOG_NOT_FOUND" }

	const post = await prisma.post.findFirst({
		where: {
			slug: postSlug,
			blogId: blog.data.id,
			deletedAt: null
		},
		include: {
			user: true
		}

	})
	return { data: postMessage }
}


