import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IWhere } from 'src/common/interfaces/where.interface';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class FollowUpService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createFollowUpDto: CreateFollowUpDto) {
    const data = await this.followUp.create({
      data: createFollowUpDto,
      select: {
        id: true,
        name: true
      }
    })
    return TransformResponse.map(data, 'Follow up creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);

    //? En caso de agregar un filtro se agrega en el count
    const totalRows = await this.followUp.count();

    const data = await this.followUp.findMany({
      ...filter,
      select: {
        id: true,
        name: true
      }
    })

    return TransformResponse.map({
      data: data,
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
    const followUp = await this.followUp.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
      }
    })
    if (!followUp) {
      throw new HttpException(
        `Follow up not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(followUp);
  }

  async update(id: number, updateFollowUpDto: UpdateFollowUpDto) {
    await this.findOne(id);
    const data = await this.followUp.update({
      where: { id },
      data: updateFollowUpDto,
      select: {
        id: true,
        name: true,
      }
    })
    return TransformResponse.map(data, 'Follow up actualizado correctamente!!', 'PATCH');
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: IWhere = {
      orderBy: [{ id: 'desc' }],
    };

    if (paginated) {
      condition.skip = (page - 1) * perPage;
      condition.take = perPage;
    }
    return condition
  }
}
