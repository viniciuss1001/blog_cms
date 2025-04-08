import UsersPage from "@/components/pages/admin/users";
import { getBlogUsers } from "@/server/admin/blogUserService";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'Usuários | Dashboard'
}

type Props = {
	params: {
		blog_slug: string
	}
}

const AdminUsers = async ({ params }: Props) => {

	const { blog_slug } = params

	const users = await getBlogUsers({ blogSlug: blog_slug })

	return (
		<UsersPage
			users={users.data!}
		/>
	)
}

export default AdminUsers