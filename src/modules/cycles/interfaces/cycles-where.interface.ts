import { Prisma } from '@prisma/client'
import { IWhere } from 'src/common/interfaces/where.interface'
export interface ICycleWhere extends IWhere {
	where: Prisma.CyclesWhereInput
}
