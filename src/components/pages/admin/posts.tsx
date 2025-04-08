"use client"

import { deleteBlogPost } from "@/server/admin/blogPostServices"
import { PostWithUser } from "@/types/post"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { TableProps, Space, Tag, Button, Popconfirm, Table } from "antd"
import { useTranslations } from "next-intl"

type Props = {
	posts: PostWithUser[]
}

type DataType = PostWithUser & {
	key: string
}

import React, { useState } from 'react'
import NewBlogPost from "../components/new-blog-post"
import EditBlogPost from "../components/edit-blog-post"
import AdminHero from "../components/Admin-hero"

const PostsPage = ({ posts }: Props) => {

	const pageTranslations = useTranslations('PostsPage')
	const formTranslations = useTranslations('Form')
	const commonTranslations = useTranslations('Common')

	const [loading, setLoading] = useState<boolean>(false)
	const [newBlogPostOpen, setNewBlogPostOpen] = useState(false)
	const [editBlogPost, setEditBlogPost] = useState<PostWithUser>()

	const handleDeletePost = async (postId: string) => {
		setLoading(true)
		await deleteBlogPost({ postId })
		setLoading(false)
	}

	const columns: TableProps<DataType>['columns'] = [
		{
			title: formTranslations('title_label'),
			dataIndex: ['title'],
			key: 'title',
			sorter: (a, b) => a.title.localeCompare(b.title)!,
			sortDirections: ['descend', 'ascend'],
			ellipsis: true
		},
		{
			title: formTranslations('slug_label'),
			dataIndex: ['slug'],
			key: 'slug',
			sorter: (a, b) => a.slug.localeCompare(b.slug)!,
			sortDirections: ['descend', 'ascend'],
			ellipsis: true
		},
		{
			title: formTranslations('author_label'),
			dataIndex: ['user', 'name'],
			key: 'user.name',
			sorter: (a, b) => a.user.name!.localeCompare(b.user.name!)!,
			sortDirections: ['descend', 'ascend'],
			ellipsis: true,
			render: (_, record) => (
				<Space>
					<Tag color="blue">{record.user.name}</Tag>
					<Tag color="gold">{record.user.email}</Tag>
				</Space>
			)
		},
		{
			title: commonTranslations('actions'),
			key: 'action',
			width: '8%',
			render: (_, record) => (
				<Space>
					<Button
						type="text"
						size="small"
						className="text-blue-700"
						onClick={() => setEditBlogPost(record)}
					>
						<EditOutlined className="text-lg" />
					</Button>

					<Popconfirm
						title={pageTranslations('remove_post_label')}
						description={pageTranslations('remove_post_description')}
						rootClassName="max-w-72"
						onConfirm={() => handleDeletePost(record.id)}
						okText={commonTranslations('continue')}
						cancelText={commonTranslations('cancel')}
					>
						<Button
							type="text"
							size="small"
							danger
						>
							<DeleteOutlined className="text-lg" />
						</Button>
					</Popconfirm>
				</Space>
			)
		}
	];

	return (
		<>
			<NewBlogPost
				open={newBlogPostOpen}
				setOpen={setNewBlogPostOpen}
			/>
			<EditBlogPost
				open={!!editBlogPost}
				onClose={() => setEditBlogPost(undefined)}
				defaultValues={editBlogPost!}
			/>

			<div className="space-y-6 pb-5">
				<AdminHero
					title={pageTranslations('title')}
					description={pageTranslations('description')}
					extra={
						<Button
							type="primary"
							onClick={() => setNewBlogPostOpen(true)}
						>
							{pageTranslations('new_post_label')}
						</Button>
					}
				/>
				<div className="px-4">
					<Table
						loading={loading}
						columns={columns}
						pagination={false}
						dataSource={posts.map(item => ({ ...item, key: item.id }))}
					/>
				</div>
			</div>
		</>
	)
}

export default PostsPage