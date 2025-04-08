"use client"
import dynamic from 'next/dynamic'
import { sendPromptToGemini } from '@/lib/gemini'
import { createBlogPost } from '@/server/admin/blogPostServices'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Space, Spin, theme, Tooltip } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})

type Props = {
	open: boolean
	setOpen: (open: boolean) => void
}

type FieldType = {
	title: string
	subtitle: string
	slug: string
	body: string
}

const NewBlogPost = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [form] = Form.useForm()
	const { blogSelected } = useAdminBlogStore()

	const newPostTranslations = useTranslations('NewBlog')
	const formTranslations = useTranslations('Form')
	const commonTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')

	const locale = useLocale()
	const { token: { colorPrimary } } = theme.useToken()

	const onClose = () => setOpen(false)

	const handleAIGenerate = async () => {
		setLoading(true)
		const response = await sendPromptToGemini({
			prompt:
				`
				 Escreva um post para um blog, o tema deve ser relacionado as configurações/tema do blog: ${blogSelected?.title}; ${blogSelected?.subtitle}. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do post (max. 100 caracteres)",
                    "subtitle": "Descrição do post (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)",
                    "body": "Conteúdo do post (Use HTML para formatar o conteúdo - Não use markdown)",
                }
				`
		})
		form.setFieldsValue(response)
		setLoading(false)
	}

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		if (!blogSelected) return

		setLoading(true)
		const blogPost = await createBlogPost({ data: { ...values, blogId: blogSelected.id } })
		setLoading(false)

		if (blogPost?.error) {
			message.error(errorsTranslations(`blog/${blogPost.error}`))
		} else {
			message.success(newPostTranslations('success'))
			setOpen(false)
		}
	}

	useEffect(() => {
		form.resetFields()
	}, [blogSelected])


	return (
		<Drawer
			title={newPostTranslations('title')}
			width={600}
			onClose={onClose}
			open={open}
			styles={{
				body: {
					paddingBottom: 80
				}
			}}
			extra={
				
				<Space>
					<Tooltip
						title={newPostTranslations('ai_tooltip')}
						className='mr-2'
					>
						<Button type='text' onClick={handleAIGenerate}>
							<ThunderboltOutlined classID='text-xl' style={{ color: colorPrimary }} />
						</Button>
					</Tooltip>
					<Button onClick={onClose}>
						{commonTranslations('cancel')}
					</Button>
					<Button type='primary' onClick={form.submit} loading={loading}>
						{commonTranslations('save')}
					</Button>
				</Space>
			}
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

export default NewBlogPost