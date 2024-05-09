import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAsetnameDto } from './dto/create-asetname.dto';
import { UpdateAsetnameDto } from './dto/update-asetname.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { IAsetNameWhere } from './interfaces/aset-name-where.interface';

@Injectable()
export class AsetnameService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createAsetnameDto: CreateAsetnameDto) {
    const data = await this.asetName.create({
      data: createAsetnameDto,
      select: {
        id: true,
        name: true,
      }
    })
    return TransformResponse.map(data, 'Aset name Creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);

    //? En caso de agregar un filtro se agrega en el count
    const totalRows = await this.asetName.count({ where: filter.where });

    const data = await this.asetName.findMany({
      ...filter,
      select: {
        id: true,
        name: true,
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

  async findOne(id: string) {
    const asetname = await this.asetName.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
      }
    })
    if (!asetname) {
      throw new HttpException(
        `Aset name not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(asetname);
  }

  async update(id: string, updateAsetnameDto: UpdateAsetnameDto) {
    await this.findOne(id);
    const data = await this.asetName.update({
      where: { id },
      data: updateAsetnameDto,
      select: {
        id: true,
        name: true,
      }
    });
    return TransformResponse.map(data, 'Aset Name actualizado correctamente!!', 'PATCH');
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.asetName.update({
      where: { id },
      data: { available: false }
    });
    return TransformResponse.map(data, 'Aset name eliminado con éxito!!', 'DELETE')
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: IAsetNameWhere = {
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
