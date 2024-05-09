import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface IFollowUpWhere extends IWhere {
    where: Prisma.FollowUpWhereInput
}