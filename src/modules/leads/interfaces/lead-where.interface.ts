import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface ILeadWhere extends IWhere {
    where: Prisma.LeadsWhereInput
}