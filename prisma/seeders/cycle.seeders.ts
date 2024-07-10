import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: "ENERO-DICIEMBRE", cycle: '2024-2' },
	{ name: "ENERO-DICIEMBRE", cycle: '2025-1' },
	{ name: "ENERO-DICIEMBRE", cycle: '2024-2025' },
	{ name: "ENERO-DICIEMBRE", cycle: '2025-2' },
	{ name: "ENERO-DICIEMBRE", cycle: '2025-2026' },
	{ name: "ENERO-DICIEMBRE", cycle: '2026-1' },
]

export async function CyclesSeeder() {
	const cycles = await prisma.cycles.createMany({
		data,
		skipDuplicates: true,
	})
}