"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateBlogPost } from '@/server/admin/blogPostServices'
import { createBlogUser } from '@/server/admin/blogUserService'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { PostWithUser } from '@/types/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { BlogUser } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { toast } from 'sonner'
import { z } from 'zod'


type Props = {
	open: boolean
	setOpen: (open: boolean) => void
}

type FieldType = {
	email: string
	role: BlogUser['role']
}

const formSchema = z.object({
	email: z.string().email().max(191),
	role: z.enum(['ADMIN', 'AUTHOR', 'EDITOR'])
})

type FormValues = z.infer<typeof formSchema>

const NewBlogUser = ({ open, setOpen }: Props) => {

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			role: 'AUTHOR'
		}
	})

	const [loading, setLoading] = useState<boolean>(false)

	const { blogSelected } = useAdminBlogStore()

	const NewBlogUserTranslations = useTranslations('NewBlogUser')
	const formTranslations = useTranslations('Form')
	const commomTranslations = useTranslations('Common')
	const errorsTranslations = useTranslations('Errors')

	const onClose = () => {
		setOpen(false)
	}

	const onSubmit = async (values: FormValues) => {
		if (!blogSelected) return

		setLoading(true)
		const blogUser = await createBlogUser({ data: { ...values, blogId: blogSelected.id } })
		setLoading(false)

		if (blogUser?.error) {
			toast.error(errorsTranslations(`blog/${blogUser.error}`))
		} else {
			toast.success(NewBlogUserTranslations('success'))
			form.reset()
			setOpen(false)
		}

	}

	useEffect(() => {
		form.reset()
	}, [blogSelected])


	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{NewBlogUserTranslations('title')}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{formTranslations('user_email_label')}
									</FormLabel>
									<FormControl>
										<Input placeholder='email@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='role'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{formTranslations('role_label')}
									</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Selecionar Cargo" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ADMIN">{commomTranslations('admin')}</SelectItem>
												<SelectItem value="AUTHOR">{commomTranslations('author')}</SelectItem>
												<SelectItem value="EDITOR">{commomTranslations('editor')}</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type='submit' disabled={loading}>
								{loading && <Loader2 className='animate-spin'/>}
								{commomTranslations('save')}
							</Button>
						</DialogFooter>
					</form>
				</Form>

			</DialogContent>
		</Dialog>
	)
}

export default NewBlogUser