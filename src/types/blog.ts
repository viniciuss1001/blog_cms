import { Prisma } from '@prisma/client'

export type BlogWithUsers = Prisma.BlogGetPayload<{
	include: {
		users: true
	}
}>

export type BlogUserWithUser = Prisma.BlogUserGetPayload<{
	include: {
		user: true
	}
}>