"use client"

import { DeleteOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Select, Table, TableProps, Tag } from "antd"
import { useTranslations } from "next-intl"
import { deleteBlogUser, updateBlugUserRole } from "@/server/admin/blogUserService"
import { BlogUserWithUser } from "@/types/blog"
import { BlogUser } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useState } from 'react'
import AdminHero from "../components/Admin-hero"
import NewBlogUser from "../components/new-blog-user"


type Props = {
	users: BlogUserWithUser[]
}

type DataType = BlogUserWithUser & {
	key: string
}

const UsersPage = ({ users }: Props) => {

	const pageTranslations = useTranslations('UsersPage')
	const formTranslations = useTranslations('Form')
	const commonTranslations = useTranslations('Common')

	const session = useSession()

	const [loading, setLoading] = useState<boolean>(false)
	const [newBlogPostOpen, setNewBlogPostOpen] = useState(false)

	const handleChangeRole = async (blogUserId: string, role: BlogUser['role']) => {
		setLoading(true)
		await updateBlugUserRole({ blogUserId, data: { role } })
		setLoading(false)
	}

	const handleDeleteUser = async (blogUserId: string) => {
		setLoading(true)
		await deleteBlogUser({ blogUserId })
		setLoading(false)
	}

	const columns: TableProps<DataType>['columns'] = [
		{
			title: formTranslations('user_name_label'),
			dataIndex: ['user', 'name'],
			key: 'name',
			sorter: (a, b) => a.user.name!.localeCompare(b.user.name!)!,
			sortDirections: ['descend', 'ascend'],
			ellipsis: true
		},
		{
			title: formTranslations('user_email_label'),
			dataIndex: ['user', 'email'],
			key: 'email',
			sorter: (a, b) => a.user.email!.localeCompare(b.user.email!)!,
			sortDirections: ['descend', 'ascend'],
			ellipsis: true
		},
		{
			title: formTranslations('role_label'),
			dataIndex: 'role',
			key: 'role',
			width: '12%',
			render: (_, record) => (
				<div className="pr-2">
					{record.role === 'OWNER' ?
						<Tag color="gold">{commonTranslations('owner')}</Tag>
						:
						<Select
							defaultValue={record.role}
							className="w-full"
							variant="borderless"
							disabled={session.data?.user?.id === record.userId}
							onChange={newRole => handleChangeRole(record.id, newRole)}
							size="small"
							options={[
								{ value: 'ADMIN', label: commonTranslations('admin') },
								{ value: 'AUTHOR', label: commonTranslations('author') },
								{ value: 'EDITOR', label: commonTranslations('editor') },
							]}
						/>
					}
				</div>
			)
		},
		{
			title: commonTranslations('actions'),
			key: 'action',
			width: '8%',
			render: (_, record) => (
				<>
					{record.role !== 'OWNER' && session.data?.user?.id !== record.userId &&
						<Popconfirm
							title={pageTranslations('remove_user_label')}
							description={pageTranslations('remove_user_description')}
							rootClassName="max-w-72"
							onConfirm={() => handleDeleteUser(record.id)}
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
					}
				</>
			)
		}
	];

	return (
		<>
			<NewBlogUser
				open={newBlogPostOpen}
				setOpen={setNewBlogPostOpen}
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
							{pageTranslations('new_user_label')}
						</Button>
					}
				/>
				<div className="px-4">
					<Table
						loading={loading}
						columns={columns}
						pagination={false}
						dataSource={users.map(item => ({ ...item, key: item.id }))}
					/>
				</div>
			</div>
		</>
	)
}

export default UsersPage