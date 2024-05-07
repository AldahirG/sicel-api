import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IWhere } from 'src/common/interfaces/where.interface';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class CareersService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createCareerDto: CreateCareerDto) {
    const data = await this.career.create({
      data: createCareerDto,
      select: {
        id: true,
        name: true,
        slug: true
      }
    })
    return TransformResponse.map(data, 'Career creada con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);

    //? En caso de agregar un filtro se agrega en el count
    const totalRows = await this.career.count();

    const data = await this.career.findMany({
      ...filter,
      select: {
        id: true,
        name: true,
        slug: true
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
    const data = await this.career.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    if (!data) {
      throw new HttpException(
        `Career not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(data);
  }

  async update(id: number, updateCareerDto: UpdateCareerDto) {
    await this.findOne(id);
    const data = await this.career.update({
      where: { id },
      data: updateCareerDto,
      select: {
        id: true,
        name: true,
        slug: true
      }
    })
    return TransformResponse.map(data, 'Career actualizada correctamente!!', 'PATCH');
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
