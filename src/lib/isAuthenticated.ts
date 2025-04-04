import { redirect } from "next/navigation"
import { auth } from "./auth"

export const isAuthenticated = async () => {
	const session = await auth()

	if(!session?.user) redirect('/auth/signin')

	return session
}