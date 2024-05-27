import { Prisma, PrismaClient } from '@prisma/client';
import { OnModuleInit } from '@nestjs/common';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { ILeadWhere } from '../interfaces/lead-where.interface';

export class HelperService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect();
    }

    select(): Prisma.LeadsSelect {
        return {
            id: true,
            grade: true,
            dateContact: true,
            reference: true,
            scholarship: true,
            semester: true,
            information: {
                select: {
                    name: true,
                    genre: true,
                    careerInterest: true,
                    formerSchool: true,
                    typeSchool: true,
                    enrollmentStatus: true,
                    followUp: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            campaign: true,
            asetName: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    paternalSurname: true,
                    maternalSurname: true,
                    email: true
                }
            },
            city: {
                select: {
                    name: true,
                    state: {
                        select: {
                            name: true,
                            country: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
            phones: true,
            emails: true
        }
    }

    getParams(params: PaginationFilterDto): ILeadWhere {
        const {
            page,
            'per-page': perPage,
            paginated
        } = params

        const condition: ILeadWhere = {
            where: { available: true },
            orderBy: [{ id: 'desc' }],
        };

        if (paginated) {
            condition.skip = (page - 1) * perPage;
            condition.take = perPage;
        }
        return condition
    }
}