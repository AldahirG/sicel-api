import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { IPromotionWhere } from './interfaces/promotion-where.interface';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PromotionsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect()
  }

  async create(createPromotionDto: CreatePromotionDto) {
    createPromotionDto.slug = 'EsteEsUnSlug'
    const data = await this.promotions.create({
      data: createPromotionDto
    })
    return TransformResponse.map(
      data,
      'Carrera creada con éxito!!',
      'POST',
      HttpStatus.CREATED,
    )
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)
    const totalRows = await this.promotions.count({ where: filter.where })

    const data = await this.promotions.findMany({ ...filter })

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
    })
  }

  async findOne(id: string) {
    const data = await this.promotions.findFirst({
      where: { id, available: true }
    })
    if (!data) {
      throw new HttpException(
        `Career not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      )
    }
    return TransformResponse.map(data)
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    await this.findOne(id)
    const data = await this.promotions.update({
      where: { id },
      data: updatePromotionDto
    })
    return TransformResponse.map(data, 'Carrera actualizada con éxito!!', 'PUT')
  }

  async remove(id: string) {
    await this.findOne(id)
    const data = await this.promotions.update({
      where: { id },
      data: { available: false }
    })
    return TransformResponse.map(
      data,
      'Carrera eliminada con éxito!!',
      'DELETE',
    )
  }

  private getParams(params: PaginationFilterDto) {
    const { page, 'per-page': perPage, paginated } = params

    const condition: IPromotionWhere = {
      where: { available: true },
      orderBy: [{ id: 'desc' }],
    }

    if (paginated) {
      condition.skip = (page - 1) * perPage
      condition.take = perPage
    }
    return condition
  }
}
