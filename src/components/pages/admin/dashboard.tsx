"use client"

import { getDashboardData } from '@/server/admin/dashboardService'
import { useAdminBlogStore } from '@/stores/blogAdminStore'
import { DashboardData } from '@/types/dashboard'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import AdminHero from '../components/Admin-hero'
import { Card, Col, Row, Statistic } from 'antd'

const AdminDashboardPage = () => {

	const { blogSelected } = useAdminBlogStore()
	const { data } = useSession()
	const [loading, setLoading] = useState<boolean>(false)
	const [dashboardData, setDashboardData] = useState<DashboardData>()

	const t = useTranslations('DashboardPage')

	useEffect(() => {

		const handleGetDashboardData = async () => {
			if (!blogSelected) return

			setLoading(true)
			const data = await getDashboardData({
				blogId: blogSelected.id
			})
			setDashboardData(data)
			setLoading(false)
		}

		handleGetDashboardData()

	}, [blogSelected])

	return (
		<div>
			<div className='space-y-5 pb-5'>
				<AdminHero
					title={t('title', { name: data?.user?.name ?? '' })}
					description={t('description', { blogName: blogSelected?.title ?? '' })}
				/>

				<div className='px-8'>
					<Row gutter={16}>
						<Col span={8}>
							<Card>
								<Statistic
									title={t('total_users')}
									value={dashboardData?.totalUsers}
									valueStyle={{ color: '#489703' }}
									loading={loading}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card>
								<Statistic
									title={t('total_posts')}
									value={dashboardData?.totalPosts}
									valueStyle={{ color: '#ffb108' }}
									loading={loading}
								/>
							</Card>
						</Col>
						<Col span={8}>
							<Card>
								<Statistic
									title={t('your_total_post')}
									value={dashboardData?.totalPostsMadeByYou}
									valueStyle={{ color: '#0572ff' }}
									loading={loading}
								/>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	)
}

export default AdminDashboardPage