import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ICampaignWhere } from './interfaces/campaign-where.interface';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CampaignsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createCampaignDto: CreateCampaignDto) {
    const data = await this.campaigns.create({
      data: createCampaignDto,
      select: {
        id: true,
        name: true,
        campaignTypeId: true
      }
    })
    return TransformResponse.map(data, 'Campaña creada con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)

    const totalRows = await this.campaigns.count({ where: filter.where });

    const data = await this.campaigns.findMany({
      ...filter,
      select: {
        id: true,
        name: true,
        campaignTypeId: true
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
    const data = await this.campaigns.findFirst({
      where: { id, available: true },
      select: {
        id: true,
        name: true,
        campaignTypeId: true
      }
    });
    if (!data) {
      throw new HttpException(
        `Content Type not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(data);
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    await this.findOne(id);
    const data = await this.campaigns.update({
      where: { id },
      data: updateCampaignDto,
      select: {
        id: true,
        name: true,
        campaignTypeId: true
      }
    })
    return TransformResponse.map(data, 'Campaña actualizada con éxito!!', 'PUT');
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.campaigns.update({
      where: { id },
      data: { available: false },
      select: {
        id: true,
        name: true,
        campaignTypeId: true
      }
    });
    return TransformResponse.map(data, 'Campaña eliminada con éxito!!', 'DELETE')
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: ICampaignWhere = {
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
