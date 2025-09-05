import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { HelperService } from './helpers/helper.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { UserResource } from './mappers/user.mapper'
import { FilterUserDTO } from './dto/filter-user.dto'

@Injectable()
export class UsersService extends HelperService {
	async create(createUserDto: CreateUserDto) {
		const select = this.select()
		const { roles, additionalInfo: info, password, ...data } = createUserDto

		const hashedPassword = await bcrypt.hash(password, 10)

		const construct = roles.map((roleId) => ({
			role: {
				connect: { id: roleId },
			},
		}))

		const user = await this.user.create({
			data: {
				...data,
				password: hashedPassword,
				roles: {
					create: construct,
				},
				additionalInfo: {
					create: info,
				},
			},
			select,
		})
		return TransformResponse.map(
			UserResource.map(user),
			'Usuario creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: FilterUserDTO) {
		const filter = this.getParams(params)
		const select = this.select()

		const totalRows = await this.user.count({ where: filter.where })

		const users = await this.user.findMany({
			...filter,
			select,
			orderBy: {
				createAt: 'desc',
			},
		})

		return TransformResponse.map({
			data: UserResource.collection(users),
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
		const select = this.select()
		const user = await this.user.findFirst({
			where: { id, available: true },
			select,
		})
		if (!user) {
			throw new HttpException(
				`User not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(UserResource.map(user))
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id)
		const select = this.select()
		const { roles, password, additionalInfo, ...data } = updateUserDto

		let rolesUpdate = {}
		let hashedPassword = user.data.password

		if (password) {
			hashedPassword = await bcrypt.hash(password, 10)
		}

		if (roles) {
			rolesUpdate = {
				deleteMany: {},
				create: roles.map((roleId) => ({
					role: {
						connect: { id: roleId },
					},
				})),
			}
		}

		const newData = await this.user.update({
			where: { id },
			data: {
				...data,
				password: hashedPassword,
				roles: rolesUpdate,
			},
			select,
		})
		return TransformResponse.map(
			UserResource.map(newData),
			'Usuario actualizado con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const user = await this.user.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			UserResource.map(user),
			'Usuario eliminado con éxito!!',
			'DELETE',
		)
	}
}
