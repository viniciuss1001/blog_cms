"use client"
import dynamic from 'next/dynamic'
import { sendPromptToGemini } from '@/lib/gemini'
import { createBlogPost } from '@/server/admin/blogPostServices'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { ThunderboltOutlined } from '@ant-design/icons'
import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Bolt } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

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

	const { register, handleSubmit, setValue, reset, watch,
		formState: { errors, isSubmitting }
	} = useForm<FieldType>()

	const [loading, setLoading] = useState<boolean>(false)
	const { blogSelected } = useAdminBlogStore()

	const newPostTranslations = useTranslations('NewBlog')
	const formTranslations = useTranslations('Form')
	const commonTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')

	const locale = useLocale()

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
		if (response?.title && response?.body && response?.slug) {
			setValue('title', response.title)
			setValue('subtitle', response.subtitle)
			setValue('slug', response.slug)
			setValue('body', response.body)
			toast.success(newPostTranslations('ai_filled_success'))
		} else {
			toast.warning(newPostTranslations('ai_filled_error'))
		}
	}

	const onSubmit = async (values: FieldType) => {
		if (!blogSelected) return

		setLoading(true)
		const blogPost = await createBlogPost({ data: { ...values, blogId: blogSelected.id } })
		setLoading(false)

		if (blogPost?.error) {
			toast.error(errorsTranslations(`blog/${blogPost.error}`))
		} else {
			toast.success(newPostTranslations('success'))
			reset()
			setOpen(false)
		}
	}


	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerContent className='max-w-2xl mx-auto'>
				<DrawerHeader>
					<DrawerTitle>
						{newPostTranslations('title')}
					</DrawerTitle>
				</DrawerHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div>
						<Label htmlFor='title'>
							{formTranslations('title')}
						</Label>
						<Input
							id='title'
							{...register("title", { required: true, maxLength: 100 })}
							placeholder='Ex: Nova Publicação'
						/>
						{errors.title && <p className='text-xs text-red-500'>Campo obrigatório</p>}
					</div>
					<div>
						<Label htmlFor='subtitle'>{formTranslations('subtitle_label')}</Label>
						<Input
							id='subtitle'
							{...register('subtitle', { maxLength: 191 })}
							placeholder='Ex: Nome da nova publicação'
						/>
					</div>
					<div>
						<Label htmlFor='slug'>{formTranslations('slug_label')}</Label>
						<Input
							id='slug'
							{...register('slug', {
								required: true,
								pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
								maxLength: 60,
							})}
							placeholder='Ex: publicacao-nova'
						/>
						{errors.slug && <p className="text-sm text-red-500">Slug inválido</p>}
					</div>
					<div>
						<Label>{formTranslations('body_label')}</Label>
						<ReactQuill
							theme='snow'
							value={watch('body')}
							onChange={(value) => setValue('body', value)}
						/>
					</div>
				</form>

				<DrawerFooter>
					<div className='flex justify-between w-full'>
						<div className='flex gap-2'>
							<TooltipProvider>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='ghost'
											type='button'
											onClick={handleAIGenerate}
											disabled={isSubmitting}
										>
											<Bolt />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{newPostTranslations("ai_tooltip")}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>

						<div className='flex gap-2'>
							<DrawerClose asChild>
								<Button variant='outline' type='button'>
									{commonTranslations('cancel')}
								</Button>
							</DrawerClose>
							<Button type='submit' disabled={isSubmitting}>
								{commonTranslations('save')}
							</Button>
						</div>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default NewBlogPost