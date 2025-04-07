import { getMyBlogs } from "@/server/admin/blogService"
import HomePageBlogs from '@/components/pages/home-page-blogs'

const Home = async () => {
	const { data: blogs } = await getMyBlogs()

	return (
		<HomePageBlogs
			blogs={blogs}
		/>
	)

}
export default Home