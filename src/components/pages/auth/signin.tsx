"use client"

import { signIn } from '@/server/authService'
import { Button, Divider, Form, FormProps, Input, message, Space, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn as signinProvider } from 'next-auth/react'
import { FacebookFilled, GoogleCircleFilled } from '@ant-design/icons'
import { Link } from '@/lib/navigation'

type FieldType = {
	email: string
}

const SignInPage = () => {
	const signInTranslations = useTranslations('SignInPage')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Commom')
	const errorsTranslations = useTranslations('Errors')

	const [loading, setLoading] = useState<boolean>(false)

	const searchParams = useSearchParams()

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setLoading(true)
		const signin = await signIn({
			data: { email: values.email }
		})
		setLoading(false)

		if (signin?.error) {
			message.error(errorsTranslations(`/auth/${signin.error}`))
		}
	}

	const handleSignInProvider = (provider: "google" | 'facebook') => {
		setLoading(true)
		signinProvider(provider)

	}
	useEffect(() => {
		if (searchParams.get('error') === 'OAuthAccountNotLinked') {
			message.error(errorsTranslations('auth/ACCOUNT_ALREADY_EXISTS'))
		}
	}, [])

	return (
		<div className='border space-y-7 border-slate-100 dark:border-zinc-800 p-6 rounded-lg shadow w-full max-w-md'>
			<Spin spinning={loading}>
				<Form
					layout='vertical'
					onFinish={onFinish}
				>
					<Form.Item
						label={formTranslations('email_label')}
						name='email'
						rules={[{ required: true }]}
						required
					>
						<Input placeholder='example@example.com' />
					</Form.Item>
					<Form.Item className='pt-2'>
						<Button type='primary' htmlType='submit' block>
							{signInTranslations('btn_label', { provider: 'Email' })}
						</Button>
					</Form.Item>
				</Form>
				<Divider plain>
					{commomTranslations('or')}
				</Divider>
				<Space className='w-full' direction='vertical' size={16}>
					<Button
					className='font-semibold py-[17px]'
					onClick={() => handleSignInProvider('google')}
					>
						<GoogleCircleFilled />
						{signInTranslations('btn_label', { provider: 'Google' })}
					</Button>
					<Button
					className='font-semibold py-[17px]'
					onClick={() => handleSignInProvider('facebook')}
					>
						<FacebookFilled />
						{signInTranslations('btn_label', { provider: 'Facebook' })}
					</Button>

					<p className='mt-7 text-center'>
						{signInTranslations('no_account')}
						<Link href='/auth/signup'
						className='text-blue-500 ml-1'
						>
						{signInTranslations('btn_no_account_label')}
						</Link>
					</p>
				</Space>
			</Spin>
		</div>
	)
}

export default SignInPage