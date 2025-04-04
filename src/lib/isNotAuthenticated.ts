import { redirect } from "next/navigation"
import { auth } from "./auth"

export const isNotAuthenticated = async () => {
	const session = await auth()

	if(session?.user) redirect('/')

}