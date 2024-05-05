import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ISelect } from "../interfaces/select.interface";
import { PaginationFilterDto } from "src/common/dto/pagination-filter.dto";
import { IWhere } from "../interfaces/where.interface";

@Injectable()
export class HelperService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect();
    }

    select(): ISelect {
        let select: ISelect = {
            id: true,
            name: true,
            email: true,
            tel: true,
            status: true,
            roles: {
                select: {
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            }
        }
        return select
    }

    getParams(params: PaginationFilterDto) {
        const {
            search,
            page,
            'per-page': perPage,
            paginated
        } = params

        const OR = search ? [{ name: { contains: search } }] : undefined;

        const condition: IWhere = {
            where: {
                status: true,
                OR,
            },
            orderBy: [{ id: 'desc' }],
        };

        if (paginated) {
            condition.skip = (page - 1) * perPage;
            condition.take = perPage;
        }

        return condition
    }
}