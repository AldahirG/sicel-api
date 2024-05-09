import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface ICountryWhere extends IWhere {
    where: Prisma.CountriesWhereInput
}