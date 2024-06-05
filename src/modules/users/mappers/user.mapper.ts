import { Prisma } from '@prisma/client'

export class UserResource {
	static map(user: any) {
		return {
			id: user?.id,
			name: user?.name,
			paternalSurname: user?.paternalSurname,
			maternalSurname: user?.maternalSurname,
			email: user?.email,
			roles: user?.roles.map((i) => i.role.id),
			additionalInfo: user.additionalInfo,
		}
	}

	static collection(users: any[]) {
		const data = users.map((user) => ({
			id: user?.id,
			name: user?.name,
			paternalSurname: user?.paternalSurname,
			maternalSurname: user?.maternalSurname,
			email: user?.email,
			roles: user?.roles.map((i) => i.role.name),
			additionalInfo: user.additionalInfo,
		}))
		return data
	}
}
