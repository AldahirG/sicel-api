import { IWhere } from 'src/common/interfaces/where.interface'
import { Prisma } from '@prisma/client'
export interface ICampaignWhere extends IWhere {
	where: Prisma.CampaignsWhereInput
}
