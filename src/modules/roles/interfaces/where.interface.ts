import { Prisma } from '@prisma/client';
import { IWhere } from 'src/common/interfaces/where.interface';

export interface IRoleWhere extends IWhere {
    where?: Prisma.RoleWhereInput;
}
