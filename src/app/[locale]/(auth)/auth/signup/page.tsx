import SignIn from "@/components/pages/auth/signin";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Crie sua conta"
}

const SignUpPage = () => (
	<SignIn />
)

export default SignUpPage