import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { HelperService } from './helpers/helper.service';

@Injectable()
export class LeadsService extends HelperService {
  async create(createLeadDto: CreateLeadDto) {
    const { information, campaignId, asetNameId, cityId, userId, reference, ...leadData } = createLeadDto;

    const campaignConnect = campaignId ? { connect: { id: campaignId } } : undefined;
    const assetNameConnect = asetNameId ? { connect: { id: asetNameId } } : undefined;
    const userConnect = userId ? { connect: { id: userId } } : undefined;
    const cityConnect = cityId ? { connect: { id: cityId } } : undefined;

    const lead = await this.leads.create({
      data: {
        ...leadData,
        campaign: campaignConnect,
        asetName: assetNameConnect,
        user: userConnect,
        city: cityConnect,
        reference: {
          create: reference
        },
        information: {
          create: information
        },
      }
    });
    return TransformResponse.map(lead, 'Lead creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)
    const totalRows = await this.leads.count({ where: filter.where });

    const data = await this.leads.findMany({
      ...filter,
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
    const select = this.select()
    const data = await this.leads.findFirst({
      where: { id, available: true },
      select
    });
    if (!data) {
      throw new HttpException(
        `Lead not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(data);
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const select = this.select()
    const { information, campaignId, asetNameId, cityId, userId, reference, ...leadData } = updateLeadDto;

    const campaignConnect = campaignId ? { connect: { id: campaignId } } : undefined;
    const asetNameConnect = asetNameId ? { connect: { id: asetNameId } } : undefined;
    const userConnect = userId ? { connect: { id: userId } } : undefined;
    const cityConnect = cityId ? { connect: { id: cityId } } : undefined;

    const lead = await this.leads.update({
      where: { id },
      data: {
        ...leadData,
        campaign: campaignConnect,
        asetName: asetNameConnect,
        user: userConnect,
        city: cityConnect,
        reference: {
          upsert: {
            create: reference,
            update: reference
          }
        },
        information: {
          upsert: {
            create: information,
            update: information
          }
        },
      },
      select
    });
    return TransformResponse.map(lead, 'Lead actualizado con éxito!!', 'PUT', HttpStatus.OK)
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.leads.update({
      where: { id },
      data: { available: false }
    });
    return TransformResponse.map(data, 'Lead eliminado con éxito!!', 'DELETE')
  }
}
