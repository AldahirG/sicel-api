import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'WHATS' },
	{ name: 'CORREO' },
	{ name: 'TELEFONO' },
	{ name: 'FB' },
	{ name: 'LEADSALES' },
	{ name: 'MESSENGER' },
	{ name: 'PRESENCIAL' },
]

export async function ChannelsSeeder() {
	const channels = await prisma.channels.createMany({
		data: data.map((c) => ({ ...c, available: true })),
		skipDuplicates: true,
	})
}
