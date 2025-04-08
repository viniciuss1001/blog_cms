import AdminSettingsPage from "@/components/pages/admin/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'Configurações | Dashboard'
}

type Props = {
	params: {
		blog_slug: string
	}
}

const AdminSettings =  () => {

	return (
		<AdminSettingsPage/>
	)
}

export default AdminSettings