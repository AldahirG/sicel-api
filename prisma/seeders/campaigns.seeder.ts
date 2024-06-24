import { PrismaClient, CampaignsTypes } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
    { name: "CONFERENCIA EGRESADOS 20 05 24", type: CampaignsTypes.PAUTA },
    { name: "HALLOWEEN FEST", type: CampaignsTypes.PAUTA },
]

export async function CampaignsSeeder() {
	const campaigns = await prisma.campaigns.createMany({
		data,
		skipDuplicates: true,
	})
}