import React from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import HomeLayout from "@/components/layout/home-layout"


const HomeLayoutComponent = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth()

	if (!session?.user) redirect('/auth/signin')

	return (
		<SessionProvider session={session}>
			<HomeLayout>
				{children}
			</HomeLayout>
		</SessionProvider>
	)


}

export default HomeLayoutComponent