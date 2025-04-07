import AuthError from "@/components/pages/auth/error";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Opa! Algo deu errado"
}

const AuthErrorPage = () => (
	<AuthError />
)

export default AuthErrorPage