import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'APOYO TRABAJADOR' },
	{ name: 'BECA DE EXCELENCIA' },
	{ name: 'CERO INSC PAGA 1ER COLEGIATURA' },
	{ name: 'COLEGIATURA EN 2 PARCIALIDADES' },
	{ name: 'DUO 2X1' },
	{ name: 'EGRESADO NO PAGA' },
	{ name: 'FLASH PASS' },
	{ name: 'NO PAGA INSCRIPCIÓN' },
	{ name: 'PAGA INSCRIPCIÓN' },
	{ name: 'SEMESTRE O AÑO AVANZADO' },
	{ name: 'SIN PROMOCIÓN' },
]

export async function PromotionsSeeder() {
	const promotions = await prisma.promotions.createMany({
		data: data.map((p) => ({
			name: p.name,
			slug: p.name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '') // eliminar acentos
				.replace(/[^a-z0-9]+/g, '-') // reemplazar espacios por guiones
				.replace(/(^-|-$)/g, ''), // quitar guiones iniciales/finales
			available: true,
		})),
		skipDuplicates: true,
	})
}
