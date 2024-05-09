import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface IContentTypeWhere extends IWhere {
    where: Prisma.ContactTypesWhereInput
}