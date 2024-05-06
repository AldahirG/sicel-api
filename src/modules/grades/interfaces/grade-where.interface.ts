import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface IGradeWhere extends IWhere {
    where?: Prisma.GradeWhereInput
}