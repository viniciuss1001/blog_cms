import { BlogUser } from "@prisma/client"

type PermissionProps = {
	blogUsers: BlogUser[]
	userId: string
	roles: BlogUser['role'][]
}

export const hasPermission = ({blogUsers, roles, userId}: PermissionProps) => (
	blogUsers.some(item => item.userId === userId && roles.includes(item.role))
)