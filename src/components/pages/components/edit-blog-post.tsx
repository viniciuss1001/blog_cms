"use client"

import { updateBlogPost } from '@/server/admin/blogPostServices'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { PostWithUser } from '@/types/post'
import { Col, Drawer, Form, FormProps, Input, message, Row, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'


type Props = {
	open: boolean
	onClose: () => void
	defaultValues: PostWithUser
}


type FieldType = {
	title: string
	subtitle: string
	slug: string
	body: string
}

const EditBlogPost = ({ open, defaultValues, onClose }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [form] = Form.useForm()
	const { blogSelected } = useAdminBlogStore()

	const editPostTranslations = useTranslations('EditBlogPost')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')


	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		if (!blogSelected) return

		setLoading(true)
		const blogPost = await updateBlogPost({ data: values, postId: defaultValues.id })
		setLoading(false)

		if (blogPost?.error) {
			message.error(errorsTranslations(`blog/${blogPost.error}`))
		} else {
			message.success(editPostTranslations('success'))
			onClose()
		}
	}

	useEffect(() => {
		form.resetFields()
	}, [blogSelected])

	useEffect(() =>{
		form.setFieldsValue(defaultValues)
	},[defaultValues, open])

	return (
		<Drawer
			title={editPostTranslations('title')}
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
								name='title'
								label={formTranslations('title_label')}
								rules={[{ required: true, max: 100 }]}
							>
								<Input
									showCount
									maxLength={100}
									placeholder='Ex: Publicação '
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item<FieldType>
								name='subtitle'
								label={formTranslations('subtitle_label')}
								rules={[{ max: 60 }]}
							>
								<Input
									showCount maxLength={191}
									placeholder='Ex: Nome da nova publicação'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item<FieldType>
								name='slug'
								label={formTranslations('slug_label')}
								rules={[{ required: true, max: 60, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ }]}
							>
								<Input
									style={{ width: '100%' }}
									showCount
									maxLength={60}
									addonBefore='/'
									placeholder='Ex: Publicação'
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item<FieldType>
								name='body'
								label={formTranslations('body_label')}
								rules={[{ required: true }]}
							>
								<ReactQuill theme='show' value={form.getFieldValue('body')}
									onChange={
										(value) => form.setFieldsValue({ body: value })
									}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

		</Drawer>
	)
}

export default EditBlogPost