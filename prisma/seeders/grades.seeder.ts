import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'SECUNDARIA' },
	{ name: 'BACHILLERATO' },
	{ name: 'PREPARATORIA' },
	{ name: 'LIC/ING' },
	{ name: 'ESPECIALIDAD' },
	{ name: 'EJECUTIVA' },
	{ name: 'DIPLOMADO' },
	{ name: 'MAESTRÍA' },
	{ name: 'DOCTORADO' },
	{ name: 'NO ESPECIFICA' },
]

export async function GradesSeeder() {
	const grades = await prisma.grades.createMany({
		data,
		skipDuplicates: true,
	})
}
