import { Prisma } from '@prisma/client';
import { IWhere } from 'src/common/interfaces/where.interface';

export interface IUserWhere extends IWhere {
  where: Prisma.UserWhereInput;
}
