import { Prisma } from '@prisma/client';

export interface IWhere {
  where: Prisma.UserWhereInput;
  orderBy: any[];
  skip?: number;
  take?: number;
}
