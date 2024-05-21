import { IWhere } from 'src/common/interfaces/where.interface'
import { Prisma } from '@prisma/client'
export interface IGradeWhere extends IWhere {
	where: Prisma.GradesWhereInput
}
