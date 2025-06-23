import { Prisma } from '@prisma/client'
import { IWhere } from 'src/common/interfaces/where.interface'

export interface IPromotionWhere extends IWhere {
	where: Prisma.PromotionsWhereInput
}
