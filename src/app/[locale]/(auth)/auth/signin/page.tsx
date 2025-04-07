import SignIn from "@/components/pages/auth/signin";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Faça seu login"
}

const SignInPage = () => (
	<SignIn />
)

export default SignInPage