import { PrismaClient } from '@prisma/client'

import { RoleSeeder } from './roles.seeder'
import { UserSeeder } from './users.seeder'
import { ContactTypes } from './contactTypes.seeder'
import { AsetName } from './asetName.seeder'
import { GradesSeeder } from './grades.seeder'
import { CareersSeeder } from './careers.seeder'
import { CampaignsSeeder } from './campaigns.seeder'
import { FollowUpsSeeder } from './followUps.seeder'
import { CyclesSeeder } from './cycle.seeders'
import { CountriesSeeder } from './countries.seeder'
import { StatesSeeder } from './states.seeder'
import { CitiesSeeder } from './cities.seeder'

const prisma = new PrismaClient()

async function main() {
	await RoleSeeder()
	console.log('Roles creados')
	await UserSeeder()
	console.log('Usuarios creados')
	await ContactTypes()
	console.log('Medios de contactos creados')
	await AsetName()
	console.log('Aset Names creados')
	await GradesSeeder()
	console.log('Grados creados')
	await CareersSeeder()
	console.log('Carreras creadas');
	await CampaignsSeeder()
	console.log('Campañas creadas');
	await FollowUpsSeeder()
	console.log('Seguimientos creados');
	await CyclesSeeder()
	console.log('Ciclos escolares creados');
	await CountriesSeeder()
	console.log('Países creados');
	await StatesSeeder()
	console.log('Estados creados');
	await CitiesSeeder()
	console.log('Ciudades creadas');
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
