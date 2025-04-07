import VerifyEmail from "@/components/pages/auth/verify-email";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verificar Email"
}

const VerifyEmailPage = () => (
	<VerifyEmail />
)

export default VerifyEmailPage