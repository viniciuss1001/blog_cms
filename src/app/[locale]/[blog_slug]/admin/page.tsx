import AdminDashboardPage from "@/components/pages/admin/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'Dashboard'
}

const AdminDashboard = () => {
  return (
	 <AdminDashboardPage />
  )
}

export default AdminDashboard