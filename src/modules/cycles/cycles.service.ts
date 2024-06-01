import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { ICycleWhere } from './interfaces/cycles-where.interface'
import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { CreateCycleDto } from './dto/create-cycle.dto'
import { UpdateCycleDto } from './dto/update-cycle.dto'
import { PrismaClient } from '@prisma/client'
import { TransformResponse } from 'src/common/mappers/transform-response'

@Injectable()
export class CyclesService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createCycleDto: CreateCycleDto) {
		const data = await this.cycles.create({
			data: createCycleDto,
			select: {
				id: true,
				name: true,
				cycle: true,
			},
		})
		return TransformResponse.map(
			data,
			'Ciclo escolar creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.cycles.count({ where: filter.where })

		const data = await this.cycles.findMany({
			...filter,
			select: {
				id: true,
				name: true,
				cycle: true,
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
		const data = await this.cycles.findFirst({
			where: { id, available: true },
			select: {
				id: true,
				name: true,
				cycle: true,
			},
		})
		if (!data) {
			throw new HttpException(
				`Cycle not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async update(id: string, updateCycleDto: UpdateCycleDto) {
		await this.findOne(id)
		const data = await this.cycles.update({
			where: { id },
			data: updateCycleDto,
			select: {
				id: true,
				name: true,
				cycle: true,
			},
		})
		return TransformResponse.map(
			data,
			'Ciclo escolar actualizado con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.cycles.update({
			where: { id },
			data: { available: false },
			select: {
				id: true,
				name: true,
				cycle: true,
			},
		})
		return TransformResponse.map(
			data,
			'Ciclo escolar eliminada con éxito!!',
			'DELETE',
		)
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: ICycleWhere = {
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
