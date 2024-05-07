import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IWhere } from 'src/common/interfaces/where.interface';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class CampaignsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createCampaignDto: CreateCampaignDto) {
    const data = await this.campaign.create({
      data: createCampaignDto,
      select: {
        id: true,
        name: true,
        type_campaign: true
      }
    })
    return TransformResponse.map(data, 'Campaign creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);

    //? En caso de agregar un filtro se agrega en el count
    const totalRows = await this.campaign.count();

    const data = await this.campaign.findMany({
      ...filter,
      select: {
        id: true,
        name: true,
        type_campaign: true
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
    const data = await this.campaign.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        type_campaign: true
      }
    })

    if (!data) {
      throw new HttpException(
        `Campaign not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(data);
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    await this.findOne(id);
    const data = await this.campaign.update({
      where: { id },
      data: updateCampaignDto,
      select: {
        id: true,
        name: true,
        type_campaign: true
      }
    })
    return TransformResponse.map(data, 'Campaign actualizada correctamente!!', 'PATCH');
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
