import { PrismaClient, CampaignsTypes } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: 'STARTUP SKILLS', type: CampaignsTypes.PAUTA },
	{ name: 'POS_HOTSALE_MAYO_25', type: CampaignsTypes.PAUTA },
	{ name: 'POS_TOPRANKING_MAR_25', type: CampaignsTypes.PAUTA },
	{ name: 'POS_ENFOQ_ABR_25', type: CampaignsTypes.PAUTA },
	{ name: 'POS_LEDE_JUN_25', type: CampaignsTypes.PAUTA },
	{ name: 'POS_OPEN_LIC_JUN_25', type: CampaignsTypes.PAUTA },
	{ name: 'MIX_SIUB_JUN_25', type: CampaignsTypes.PAUTA },
	{ name: 'MIX_BIUB_JUN_25', type: CampaignsTypes.PAUTA },
	{ name: 'POS_UNIPUBLICA_JUN_25', type: CampaignsTypes.PAUTA },
]

export async function CampaignsSeeder() {
	const campaigns = await prisma.campaigns.createMany({
		data,
		skipDuplicates: true,
	})
}
