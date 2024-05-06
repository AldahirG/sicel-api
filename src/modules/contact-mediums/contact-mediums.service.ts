import { TransformResponse } from 'src/common/mappers/transform-response';
import { CreateContactMediumDto } from './dto/create-contact-medium.dto';
import { UpdateContactMediumDto } from './dto/update-contact-medium.dto';
import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IWhere } from 'src/common/interfaces/where.interface';

@Injectable()
export class ContactMediumsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createContactMediumDto: CreateContactMediumDto) {
    const data = await this.contactMedium.create({
      data: createContactMediumDto,
      select: {
        id: true,
        type: true
      }
    })
    return TransformResponse.map(data, 'Contact Creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);

    //? En caso de agregar un filtro se agrega en el count
    const totalRows = await this.contactMedium.count();

    const data = await this.contactMedium.findMany({
      ...filter,
      select: {
        id: true,
        type: true
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
    const contact = await this.contactMedium.findFirst({
      where: { id },
      select: {
        id: true,
        type: true,
      }
    })
    if (!contact) {
      throw new HttpException(
        `Contact medium not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(contact);
  }

  async update(id: number, updateContactMediumDto: UpdateContactMediumDto) {
    await this.findOne(id);
    const data = await this.contactMedium.update({
      where: { id },
      data: updateContactMediumDto,
      select: {
        id: true,
        type: true,
      }
    })
    return TransformResponse.map(data, 'Medio de contacto actualizado correctamente!!', 'PATCH');
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
