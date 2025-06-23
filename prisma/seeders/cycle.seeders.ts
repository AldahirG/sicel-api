import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: '2025-1', cycle: '2025-1' },
	{ name: '2025-2', cycle: '2025-2' },
	{ name: '2025-2026', cycle: '2025-2026' },
	{ name: '2026-1', cycle: '2026-1' },
	{ name: '2026-2', cycle: '2026-2' },
	{ name: '2026-2027', cycle: '2026-2027' },
	{ name: '2027-1', cycle: '2027-1' },
]

export async function CyclesSeeder() {
	await prisma.cycles.createMany({
		data,
		skipDuplicates: true,
	})
}
