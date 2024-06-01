import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { IStateWhere } from './interfaces/state-where.interface'
import { CreateStateDto } from './dto/create-state.dto'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class StatesService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createStateDto: CreateStateDto) {
		const data = await this.states.create({
			data: createStateDto,
			select: {
				id: true,
				name: true,
				country: {
					select: { name: true },
				},
			},
		})
		return TransformResponse.map(
			data,
			'Estado creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.states.count({ where: filter.where })

		const data = await this.states.findMany({
			...filter,
			select: {
				id: true,
				name: true,
				country: {
					select: { name: true },
				},
			},
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
		})
	}

	async findOne(id: string) {
		const data = await this.states.findFirst({
			where: { id, available: true },
			select: {
				id: true,
				name: true,
				country: {
					select: { id: true },
				},
			},
		})
		if (!data) {
			throw new HttpException(
				`State not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.states.update({
			where: { id },
			data: { available: false },
			select: {
				id: true,
				name: true,
			},
		})
		return TransformResponse.map(data, 'Estado eliminado con éxito!!', 'DELETE')
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: IStateWhere = {
			where: { available: true },
			orderBy: [{ id: 'desc' }],
		}

		if (paginated) {
			condition.skip = (page - 1) * perPage
			condition.take = perPage
		}
		return condition
	}
}
