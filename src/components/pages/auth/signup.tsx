"use client"

import { signUp } from '@/server/authService'
import { Button, Divider, Form, FormProps, Input, message, Space, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn as signinProvider } from 'next-auth/react'
import { FacebookFilled, GoogleCircleFilled } from '@ant-design/icons'
import { Link } from '@/lib/navigation'

type FieldType = {
	email: string
	name: string
}

const SignUpPage = () => {
	const signUpTranslations = useTranslations('SignUpPage')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Commom')
	const errorsTranslations = useTranslations('Errors')

	const [loading, setLoading] = useState<boolean>(false)

	const searchParams = useSearchParams()

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setLoading(true)
		const signup = await signUp({
			data: values
		})
		setLoading(false)

		if (signup?.error) {
			message.error(errorsTranslations(`/auth/${signup.error}`))
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
						label={formTranslations('name_label')}
						name='name'
						rules={[{ required: true, max: 70 }]}
						required
					>
						<Input placeholder='name example' />
					</Form.Item>
					<Form.Item
						label={formTranslations('email_label')}
						name='email'
						rules={[{ required: true, max: 50}]}
						required
					>
						<Input placeholder='example@example.com' />
					</Form.Item>
					<Form.Item className='pt-2'>
						<Button type='primary' htmlType='submit' block>
							{signUpTranslations('btn_label', { provider: 'Email' })}
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
						{signUpTranslations('btn_label', { provider: 'Google' })}
					</Button>
					<Button
						className='font-semibold py-[17px]'
						onClick={() => handleSignInProvider('facebook')}
					>
						<FacebookFilled />
						{signUpTranslations('btn_label', { provider: 'Facebook' })}
					</Button>

					<p className='mt-7 text-center'>
						{signUpTranslations('already_have_account')}
						<Link href='/auth/signin'
							className='text-blue-500 ml-1'
						>
							{signUpTranslations('btn_have_account_label')}
						</Link>
					</p>
				</Space>
			</Spin>
		</div>
	)
}

export default SignUpPage