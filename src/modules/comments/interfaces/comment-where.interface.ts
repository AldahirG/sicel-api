import { Prisma } from '@prisma/client'
import { IWhere } from 'src/common/interfaces/where.interface'

export interface ICommentWhere extends IWhere {
	where: Prisma.CommentsWhereInput
}
