import { Prisma } from '@prisma/client'
import { IWhere } from 'src/common/interfaces/where.interface'

export interface IChannelWhere extends IWhere {
	where: Prisma.ChannelsWhereInput
}
