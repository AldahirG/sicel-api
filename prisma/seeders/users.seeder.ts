import { Prisma, PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
const prisma = new PrismaClient()

export async function UserSeeder() {
	const hashedPassword = await bcrypt.hash('password', 10)

	const data: Prisma.UserCreateInput = {
		name: 'Ximena',
		paternalSurname: 'Martínez',
		email: 'admin@example.com',
		password: hashedPassword,
		roles: {
			create: [{ roleId: 1 }, { roleId: 2 }],
		},
	}

	await prisma.user.create({ data })
}
