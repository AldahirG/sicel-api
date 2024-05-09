import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { CreateCampaignTypeDto } from './dto/create-campaign-type.dto';
import { UpdateCampaignTypeDto } from './dto/update-campaign-type.dto';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { ICampaignTypeWhere } from './interfaces/campign-type-where.interface';

@Injectable()
export class CampaignTypesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createCampaignTypeDto: CreateCampaignTypeDto) {
    const data = await this.campaignsTypes.create({
      data: createCampaignTypeDto,
      select: {
        id: true,
        name: true
      }
    });
    return TransformResponse.map(data, 'Tipo de campaña creada con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)

    const totalRows = await this.contactTypes.count();

    const data = await this.campaignsTypes.findMany({
      ...filter,
      select: {
        id: true,
        name: true
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
    const data = await this.campaignsTypes.findFirst({
      where: { id, available: true },
      select: {
        id: true,
        name: true
      }
    });
    if (!data) {
      throw new HttpException(
        `Campaign Type not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(data);
  }

  async update(id: string, updateCampaignTypeDto: UpdateCampaignTypeDto) {
    await this.findOne(id);
    const data = await this.campaignsTypes.update({
      where: { id },
      data: updateCampaignTypeDto,
      select: {
        id: true,
        name: true
      }
    })
    return TransformResponse.map(data, 'Tipo de campaña actualizada con éxito!!', 'PUT');
  }

  async remove(id: string) {
    const data = await this.campaignsTypes.update({
      where: { id },
      data: { available: false }
    });
    return TransformResponse.map(data, 'Tipo de campaña eliminada con éxito!!', 'DELETE')
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: ICampaignTypeWhere = {
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
