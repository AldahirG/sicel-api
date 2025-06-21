import { IWhere } from 'src/common/interfaces/where.interface'
import { Prisma } from '@prisma/client'
export interface IPaymentWhere extends IWhere {
	where: Prisma.PaymentsWhereInput
}
