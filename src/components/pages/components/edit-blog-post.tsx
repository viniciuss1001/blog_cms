"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateBlogPost } from '@/server/admin/blogPostServices'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { PostWithUser } from '@/types/post'
import { zodResolver } from '@hookform/resolvers/zod'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { toast } from 'sonner'
import { z } from 'zod'


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

const formSchema = z.object({
	title: z.string().min(1).max(60),
	subtitle: z.string().max(191),
	slug: z.string().min(1).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	body: z.string()
})

type FormValues = z.infer<typeof formSchema>

const EditBlogPost = ({ open, defaultValues, onClose }: Props) => {

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	const { handleSubmit, setValue, watch, reset } = form

	const [loading, setLoading] = useState<boolean>(false)

	const { blogSelected } = useAdminBlogStore()

	const editPostTranslations = useTranslations('EditBlogPost')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')


	const onSubmit = async (values: FormValues) => {
		if (!blogSelected) return

		setLoading(true)
		const blogPost = await updateBlogPost({ data: values, postId: defaultValues.id })
		setLoading(false)

		if (blogPost?.error) {
			toast.error(errorsTranslations(`blog/${blogPost.error}`))
		} else {
			toast.success(editPostTranslations('success'))
			onClose()
		}
	}

	useEffect(() => {
		reset(defaultValues)
	}, [defaultValues, open, reset])


	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{editPostTranslations('title')}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{formTranslations('title_label')}
									</FormLabel>
									<FormControl>
										<Input placeholder='Ex: Publicação' maxLength={100} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subtitle"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{formTranslations('subtitle_label')}</FormLabel>
									<FormControl>
										<Input placeholder="Ex: Nome da nova publicação" maxLength={191} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{formTranslations('slug_label')}</FormLabel>
									<FormControl>
										<div className="flex items-center space-x-2">
											<span className="text-muted-foreground">/</span>
											<Input placeholder="Ex: publicacao" maxLength={60} {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="body"
							render={() => (
								<FormItem>
									<FormLabel>{formTranslations('body_label')}</FormLabel>
									<FormControl>
										<ReactQuill
											theme="snow"
											value={watch('body')}
											onChange={(value) => setValue('body', value)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex justify-end gap-2 pt-4'>
							<Button type='button' variant='outline' onClick={onClose}>
								{commomTranslations('cancel')}
							</Button>
							<Button type='submit' disabled={loading}>
								{commomTranslations('save')}
							</Button>
						</div>

					</form>
				</Form>

			</DialogContent>
		</Dialog>
	)
}

export default EditBlogPost