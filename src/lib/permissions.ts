import { BlogUser } from "@prisma/client"

type PermissionProps = {
	blogUser: BlogUser[]
	userId: string
	roles: BlogUser['role'][]
}

export const hasPermission = ({blogUser, roles, userId}: PermissionProps) => (
	blogUser.some(item => item.userId === userId && roles.includes(item.role))
)