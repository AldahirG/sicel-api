import { Prisma } from '@prisma/client';

export interface IRoleWhere {
    where?: Prisma.RoleWhereInput;
    orderBy: any[];
    skip?: number;
    take?: number;
}
