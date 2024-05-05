import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ISelect } from "../interfaces/select.interface";
import { IWhere } from "../interfaces/where.interface";
import { FilterUserDTO } from "../dto/filter-user.dto";

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

    getParams(params: FilterUserDTO) {
        const {
            search,
            page,
            'per-page': perPage,
            paginated,
            role
        } = params

        const OR = search ? [{ name: { contains: search } }] : undefined;

        const condition: IWhere = {
            where: {
                status: true,
                OR,
            },
            orderBy: [{ id: 'desc' }],
        };

        if (role) {
            condition.where.roles = { some: { roleId: +role } }
        }

        if (paginated) {
            condition.skip = (page - 1) * perPage;
            condition.take = perPage;
        }

        return condition
    }
}