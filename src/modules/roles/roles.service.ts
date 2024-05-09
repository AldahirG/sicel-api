import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { IRoleWhere } from './interfaces/where.interface';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RolesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }


  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);
    const totalRows = await this.roles.count({ where: filter.where });

    const roles = await this.roles.findMany({
      ...filter,
      select: {
        id: true,
        name: true
      }
    })

    return TransformResponse.map({
      data: roles,
      meta: params.paginated
        ? {
          currentPage: params.page,
          nextPage:
            Math.ceil(totalRows / params['per-page']) == params.page
              ? null
              : params.page + 1,
          totalPages: Math.ceil(totalRows / params['per-page']),
          perPage: params['per-page'],
          totalRecords: totalRows,
          prevPage: params.page == 1 ? null : params.page - 1,
        }
        : undefined,
    });
  }

  async findOne(id: number) {
    const role = await this.roles.findFirst({
      where: { id },
      select: {
        id: true,
        name: true
      }
    })

    if (!role) {
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(role);
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: IRoleWhere = {
      orderBy: [{ id: 'desc' }],
    };

    if (paginated) {
      condition.skip = (page - 1) * perPage;
      condition.take = perPage;
    }

    return condition
  }
}
