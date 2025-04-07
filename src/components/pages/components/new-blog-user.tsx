"use client"

import { updateBlogPost } from '@/server/admin/blogPostServices'
import { createBlogUser } from '@/server/admin/blogUserService'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { PostWithUser } from '@/types/post'
import { BlogUser } from '@prisma/client'
import { Col, Drawer, Form, FormProps, Input, message, Row, Select, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'


type Props = {
	open: boolean
	setOpen: (open: boolean) => void
}

type FieldType = {
	email: string
	role: BlogUser['role']
}

const NewBlogUser = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [form] = Form.useForm()
	const { blogSelected } = useAdminBlogStore()

	const NewBlogUserTranslations = useTranslations('NewBlogUser')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Commom')
	const errorsTranslations = useTranslations('Errors')

	const onClose = () => {
		setOpen(false)
	}

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		if (!blogSelected) return

		setLoading(true)
		const blogUser = await createBlogUser({ data: {...values, blogId: blogSelected.id} })
		setLoading(false)

		if (blogUser?.error) {
			message.error(errorsTranslations(`blog/${blogUser.error}`))
		} else {
			message.success(NewBlogUserTranslations('success'))
			setOpen(false)
		}
	}

	useEffect(() => {
		form.resetFields()
	}, [blogSelected])

	
	return (
		<Drawer
			title={NewBlogUserTranslations('title')}
			width={520}
			onClose={onClose}
			open={open}
			styles={{
				body: {
					paddingBottom: 80
				}
			}}

		>
			<Spin spinning={loading}>
				<Form
					form={form}
					layout='vertical'
					requiredMark='optional'
					onFinish={onFinish}

				>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item<FieldType>
								name='email'
								label={formTranslations('user_email_label')}
								rules={[{ required: true, max: 191 }]}
							>
								<Input
									showCount
									maxLength={191}
									placeholder='Ex: email@example.com '
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item<FieldType>
								name='role'
								label={formTranslations('role_label')}
								rules={[{ required: true }]}
							>
								<Select 
								placeholder="Escolher cargo."
								options={[
									{value: 'ADMIN', label: commomTranslations('admin')},
									{value: 'AUTHOR', label: commomTranslations('author')},
									{value: 'EDITOR', label: commomTranslations('editor')},
								]}
								/>

							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

		</Drawer>
	)
}

export default NewBlogUser