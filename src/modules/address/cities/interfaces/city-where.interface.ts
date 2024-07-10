import { IWhere } from 'src/common/interfaces/where.interface'
import { Prisma } from '@prisma/client'

export interface ICityWhere extends IWhere {
	where: Prisma.CitiesWhereInput
}
