import { Prisma } from '@prisma/client'
import { IWhere } from 'src/common/interfaces/where.interface'

export interface IAsetNameWhere extends IWhere {
	where: Prisma.asetNameWhereInput
}
