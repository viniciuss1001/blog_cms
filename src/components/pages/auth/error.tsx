"use client"

import { Link } from "@/lib/navigation"
import { WarningFilled } from "@ant-design/icons"
import { Button, Result, theme } from "antd"
import { useTranslations } from "next-intl"

const AuthError = () => {

	const { token: { red5 } } = theme.useToken()

	const t = useTranslations("AuthErrorPage")



	return (
		<Result
			status='error'
			icon={< WarningFilled />}
			style={{ color: red5 }}
			title={t('title')}
			subTitle={'subtitle'}
			className="max-w-3xl"
			extra={
				<Link
					href='/auth/signin'
				>
					<Button type="primary">
						{t('btn_label')}
					</Button>
				</Link>
			}
		/>

	)
}

export default AuthError