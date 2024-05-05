import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HelperService } from './helpers/helper.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends HelperService {

  async create(createUserDto: CreateUserDto) {
    const { roles, ...data } = createUserDto;

    const construct = roles.map(roleId => ({
      role: {
        connect: { id: roleId }
      }
    }))

    const user = await this.user.create({
      data: {
        ...data,
        roles: {
          create: construct
        }
      },
      select: this.select(),
    });

    return TransformResponse.map(user, 'Usuario creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)
    const select = this.select()

    const totalRows = await this.user.count({ where: filter.where });

    const users = await this.user.findMany({
      ...filter,
      select,
    });

    return TransformResponse.map({
      data: users,
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
    const select = this.select()
    const user = await this.user.findFirst({
      where: { id, status: true },
      select
    });
    if (!user) {
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const select = this.select()
    const { roles, password, ...data } = updateUserDto

    let rolesUpdate = {};

    const hashedPassword = await bcrypt.hash(password, 10);

    if (roles) {
      rolesUpdate = {
        deleteMany: {},
        create: roles.map(roleId => ({
          role: {
            connect: { id: roleId }
          }
        })),
      };
    }

    const newData = await this.user.update({
      where: { id },
      data: {
        ...data,
        password: hashedPassword,
        roles: rolesUpdate
      },
      select
    })
    return TransformResponse.map(newData, 'Usuario actualizado con éxito!!', 'PUT');
  }

  async remove(id: number) {
    const user = await this.user.update({
      where: { id },
      data: { status: false }
    });
    return TransformResponse.map(user, 'Usuario eliminado con éxito!!', 'DELETE')
  }
}
