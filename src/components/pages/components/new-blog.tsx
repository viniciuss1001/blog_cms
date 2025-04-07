"use client"

type Props = {
	open: boolean
	setOpen: (open: boolean) => void
}

type FieldType = {
	title: string
	subtitle: string
	slug: string
	bgColor: string
	textColor: string
}

import { sendPromptToGemini } from '@/lib/gemini'
import { createBlog } from '@/server/admin/blogService'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Form, FormProps, Input, message, Row, Space, Spin, theme, Tooltip } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

const NewBlog = ({ open, setOpen }: Props) => {

	const [loading, setLoading] = useState<boolean>(false)
	const [form] = Form.useForm()

	const newBlogTranslations = useTranslations('NewBlog')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')

	const locale = useLocale()
	const { token: { colorPrimary } } = theme.useToken()

	const onClose = () => setOpen(false)

	const handleAIGenerate = async () => {
		setLoading(true)
		const response = await sendPromptToGemini({
			prompt:
				`
				 Escreva um blog sobre qualquer tema de sua escolha. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do blog (max. 60 caracteres)",
                    "subtitle": "Descrição do blog (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)" 
                }
				`
		})
		form.setFieldsValue(response)
		setLoading(false)
	}

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
		setLoading(true)
		const blog = await createBlog({ data: values })
		setLoading(false)

		if (blog?.error) {
			message.error(errorsTranslations(`blog/${blog.error}`))
		}
	}

	return (
		<Drawer
			title={newBlogTranslations('title')}
			width={720}
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
						title={newBlogTranslations('ai_tooltip')}
						className='mr-2'
					>
						<Button type='text' onClick={handleAIGenerate}>
							<ThunderboltOutlined classID='text-xl' style={{ color: colorPrimary }} />
						</Button>
					</Tooltip>
					<Button onClick={onClose}>
						{commomTranslations('cancel')}
					</Button>
					<Button type='primary' onClick={form.submit} loading={loading}>
						{commomTranslations('save')}
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
					initialValues={{
						bgColor: '#ffffff',
						textColor: '#000000'
					}}
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name='title'
								label={formTranslations('title_label')}
								rules={[{ required: true, max: 60 }]}
							>
								<Input
									showCount
									maxLength={60}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
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
									placeholder='Ex: meu-blog'
								/>
							</Form.Item>
						</Col>

					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item<FieldType>
								name='bgColor'
								label={formTranslations('bg_color_label')}
								rules={[{ required: true, max: 60 }]}
							>
								<Input
									style={{ width: '100%' }}
									type='color'
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item<FieldType>
								name='textColor'
								label={formTranslations('text_color_label')}
								rules={[{ required: true, max: 60 }]}
							>
								<Input
									style={{ width: '100%' }}
									type='color'
								/>
							</Form.Item>
						</Col>

					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item<FieldType>
								name='subtitle'
								label={formTranslations('subtitle_label')}
								rules={[{ max: 60 }]}
							>
								<Input.TextArea
									showCount rows={4} maxLength={191}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

		</Drawer>
	)
}

export default NewBlog