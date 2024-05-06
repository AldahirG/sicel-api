import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IGradeWhere } from './interfaces/grade-where.interface';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class GradesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async create(createGradeDto: CreateGradeDto) {
    const grade = await this.grade.create({
      data: createGradeDto,
      select: {
        id: true,
        name: true,
      }
    });
    return TransformResponse.map(grade, 'Grado Creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params);
    const totalRows = await this.grade.count({ where: filter.where });

    const grades = await this.grade.findMany({
      ...filter,
      select: {
        id: true,
        name: true
      }
    })

    return TransformResponse.map({
      data: grades,
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
    const grade = await this.grade.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
      }
    })

    if (!grade) {
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return TransformResponse.map(grade);
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    await this.findOne(id);
    const data = await this.grade.update({
      where: { id },
      data: updateGradeDto,
      select: {
        id: true,
        name: true,
      }
    })
    return TransformResponse.map(data, 'Grado actualizado correctamente!!', 'PATCH');
  }

  private getParams(params: PaginationFilterDto) {
    const {
      page,
      'per-page': perPage,
      paginated
    } = params

    const condition: IGradeWhere = {
      orderBy: [{ id: 'desc' }],
    };

    if (paginated) {
      condition.skip = (page - 1) * perPage;
      condition.take = perPage;
    }

    return condition
  }
}
