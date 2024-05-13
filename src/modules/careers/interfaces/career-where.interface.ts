import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface ICareerWhere extends IWhere {
    where: Prisma.CareersWhereInput
}