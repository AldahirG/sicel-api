import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'Administrador' },
	{ name: 'Promotor' },
	{ name: 'Coordinador' },
]

export async function RoleSeeder() {
	const roles = await prisma.roles.createMany({
		data,
		skipDuplicates: true,
	})
}
