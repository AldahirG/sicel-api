import { Prisma } from "@prisma/client";
import { IWhere } from "src/common/interfaces/where.interface";

export interface ICampaignTypeWhere extends IWhere {
    where: Prisma.CampaignsTypesWhereInput
}