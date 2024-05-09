import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface IStateWhere extends IWhere {
    where: Prisma.StatesWhereInput
}