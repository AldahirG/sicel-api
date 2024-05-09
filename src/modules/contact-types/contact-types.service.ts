import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { IContentTypeWhere } from './interfaces/content-type-where.interface';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { CreateContactTypeDto } from './dto/create-contact-type.dto';
import { UpdateContactTypeDto } from './dto/update-contact-type.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ContactTypesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createContactTypeDto: CreateContactTypeDto) {
    const data = await this.contactTypes.create({
      data: createContactTypeDto,
      select: {
        id: true,
        name: true
      }
    });
    return TransformResponse.map(data, 'Tipo de contacto creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)

    const totalRows = await this.contactTypes.count();

    const data = await this.contactTypes.findMany({
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
    const data = await this.contactTypes.findFirst({
      where: { id, available: true }
    });
    if (!data) {
      throw new HttpException(
        `Content Type not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(data);
  }

  async update(id: string, updateContactTypeDto: UpdateContactTypeDto) {
    await this.findOne(id);
    const data = await this.contactTypes.update({
      where: { id },
      data: updateContactTypeDto
    })
    return TransformResponse.map(data, 'Tipo de contacto actualizado con éxito!!', 'PUT');
  }

  async remove(id: string) {
    const data = await this.contactTypes.update({
      where: { id },
      data: { available: false }
    });
    return TransformResponse.map(data, 'Tipo de contacto eliminado con éxito!!', 'DELETE')
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: IContentTypeWhere = {
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
