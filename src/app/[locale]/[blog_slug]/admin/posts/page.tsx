import PostsPage from "@/components/pages/admin/posts";
import { getBlogPosts } from "@/server/admin/blogPostServices";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'Publicações | Dashboard'
}

type Props = {
	params: {
		blog_slug: string
	}
}

const AdminPosts = async ({ params: { blog_slug } }: Props) => {


	const posts = await getBlogPosts({ blogSlug: blog_slug })

	return (
		<PostsPage
			posts={posts.data!}
		/>
	)
}

export default AdminPosts