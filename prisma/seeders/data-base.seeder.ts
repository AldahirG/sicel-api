import { PrismaClient } from '@prisma/client'

import { RoleSeeder } from './roles.seeder'
import { UserSeeder } from './users.seeder'
import { ContactTypes } from './contactTypes.seeder'
import { AsetName } from './asetName.seeder'
import { GradesSeeder } from './grades.seeder'

const prisma = new PrismaClient()

async function main() {
	await RoleSeeder()
	console.log('Roles creados')
	await UserSeeder()
	console.log('Usuarios creados')
	await ContactTypes()
	console.log('Tipos de contactos creados')
	await AsetName()
	console.log('Aset Names creados')
	await GradesSeeder()
	console.log('Grades creados')
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
