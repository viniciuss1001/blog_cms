import { BlogWithUsers } from '@/types/blog'
import { Blog } from '@prisma/client'
import { create } from 'zustand'

export type BlogState = {
	blogs: Blog[],
	blogSelected: BlogWithUsers | null
}

export type BlogActions = {
	setBlog: (blogs: Blog[]) => void,
	setBlogSelected: (blog: BlogWithUsers | null) => void
}

export const useAdminBlogStore = create<BlogState & BlogActions>((set) => ({
	blogs: [],
	blogSelected: null,
	setBlog: (blogs) => set({ blogs }),
	setBlogSelected: (blog) => set({ blogSelected: blog })
}))