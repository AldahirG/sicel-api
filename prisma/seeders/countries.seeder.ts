import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: "MEXICO" },
]

export async function CountriesSeeder() {
	const countries = await prisma.countries.createMany({
		data,
		skipDuplicates: true,
	})
}