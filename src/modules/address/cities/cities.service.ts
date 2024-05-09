import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { PrismaClient } from '@prisma/client';
import { ICityWhere } from './interfaces/city-where.interface';

@Injectable()
export class CitiesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createCityDto: CreateCityDto) {
    const data = await this.cities.create({
      data: createCityDto,
      select: {
        id: true,
        name: true,
        state: {
          select: {
            name: true
          }
        }
      }
    });
    return TransformResponse.map(data, 'Ciudad creada con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)

    const totalRows = await this.cities.count({ where: filter.where });

    const data = await this.cities.findMany({
      ...filter,
      select: {
        id: true,
        name: true,
      }
    });

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

  async findOne(id: string) {
    const data = await this.cities.findFirst({
      where: { id, available: true },
      select: {
        id: true,
        name: true,
        state: {
          select: {
            name: true
          }
        }
      }
    });
    if (!data) {
      throw new HttpException(
        `City not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(data);
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.cities.update({
      where: { id },
      data: { available: false },
      select: {
        id: true,
        name: true,
      }
    });
    return TransformResponse.map(data, 'Ciudad eliminada con éxito!!', 'DELETE')
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: ICityWhere = {
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
