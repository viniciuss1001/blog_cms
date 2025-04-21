"use client"

import { Button } from '@/components/ui/button'
import { Drawer, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sendPromptToGemini } from '@/lib/gemini'
import { createBlog } from '@/server/admin/blogService'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { Bolt, Loader2 } from 'lucide-react'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Props = {
	open: boolean
	setOpen: (open: boolean) => void
}


const NewBlog = ({ open, setOpen }: Props) => {

	const formSchema = z.object({
		title: z.string().min(1).max(60),
		subtitle: z.string().max(191),
		slug: z.string().min(1).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		bgColor: z.string().min(1),
		textColor: z.string().min(1)

	})

	type FormValues = z.infer<typeof formSchema>

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			subtitle: "",
			slug: "",
			bgColor: "#ffffff",
			textColor: "#000000"
		}
	})

	const [loading, setLoading] = useState<boolean>(false)


	const newBlogTranslations = useTranslations('NewBlog')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')

	const locale = useLocale()

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
		if (response?.title && response?.subtitle && response?.slug) {
			form.setValue('title', response.title)
			form.setValue('subtitle', response.subtitle)
			form.setValue('slug', response.slug)

			toast.success('Conteúdo gerado com sucesso pela IA.')
		}
		setLoading(false)
	}

	const onSubmit = async (values: FormValues) => {
		setLoading(true)
		const blog = await createBlog({ data: values })
		setLoading(false)

		if (blog?.error) {
			toast.error(errorsTranslations(`blog/${blog.error}`))
		} else {
			form.reset()
			onClose()
			toast.success(newBlogTranslations('created_successfully'))
		}
	}

	return (
		<Drawer open={open} onClose={onClose}>
			<DrawerHeader>
				<DrawerTitle>
					{newBlogTranslations('title')}
				</DrawerTitle>
				<DrawerDescription>
					{newBlogTranslations('description')}
				</DrawerDescription>
			</DrawerHeader>

			<div className='px-6 py-2 max-h-[70vh] overflow-y-auto'>
				{loading ? (
					<Loader2 className='animate-spin' />
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}
							className='grid gap-6'
						>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='title'
									render={({ field }) => (
										<FormItem>
											<Label>
												{formTranslations('title_label')}
											</Label>
											<FormControl>
												<Input maxLength={60}  {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='slug'
									render={({ field }) => (
										<FormItem>
											<Label>
												{formTranslations("slug_label")}
											</Label>
											<FormControl>
												<div className='flex items-center'>
													<span className='mr-2 text-muted-foreground'>
														/
													</span>
													<Input maxLength={60} placeholder='Ex: meu-blog' {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='bgColor'
									render={({ field }) => (
										<FormItem>
											<Label>{formTranslations('bg_color_label')}</Label>
											<FormControl>
												<Input type="color" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='textColor'
									render={({ field }) => (
										<FormItem>
											<Label>{formTranslations('text_color_label')}</Label>
											<FormControl>
												<Input type="color" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='subtitle'
								render={({ field }) => (
									<FormItem>
										<Label>{formTranslations('subtitle_label')}</Label>
										<FormControl>
											<Textarea maxLength={191} rows={4} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

						</form>
					</Form>
				)}
			</div>

			<DrawerFooter className='flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3 px-6 py-4 border-t'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant='ghost' onClick={handleAIGenerate} className='text-xl'>
								<Bolt className='size-5' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='top'>
							<p>{newBlogTranslations('ai_tooltip')}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<Button variant='outline' onClick={onClose}>
					{commomTranslations('cancel')}
				</Button>
				<Button type='submit' disabled={loading}>
					{commomTranslations('save')}
				</Button>
			</DrawerFooter>
		</Drawer>
	)
}

export default NewBlog