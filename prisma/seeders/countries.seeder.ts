import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'MEXICO' },
	{ name: 'ESTADOS UNIDOS' },
	{ name: 'CUBA' },
	{ name: 'USA' },
	{ name: 'COLOMBIA' },
	{ name: 'SOMALIA' },
	{ name: 'BRASIL' },
	{ name: 'VENEZUELA' },
	{ name: 'RUSIA' },
	{ name: 'PORTUGAL' },
	{ name: 'ESPAÑA' },
	{ name: 'HONDURAS' },
	{ name: 'PANAMA' },
	{ name: 'CHILE' },
	{ name: 'PERU' },
]

export async function CountriesSeeder() {
	await prisma.countries.createMany({
		data,
		skipDuplicates: true,
	})
}
