import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { ICareerWhere } from './interfaces/career-where.interface'
import { CreateCareerDto } from './dto/create-career.dto'
import { UpdateCareerDto } from './dto/update-career.dto'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class CareersService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createCareerDto: CreateCareerDto) {
		const data = await this.careers.create({
			data: createCareerDto,
		})
		return TransformResponse.map(
			data,
			'Carrera creada con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.careers.count({ where: filter.where })

		const data = await this.careers.findMany({
			...filter,
			select: {
				id: true,
				name: true,
				program: true,
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
		const data = await this.careers.findFirst({
			where: { id, available: true },
			select: {
				id: true,
				name: true,
				program: true,
			},
		})
		if (!data) {
			throw new HttpException(
				`Career not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async update(id: string, updateCareerDto: UpdateCareerDto) {
		await this.findOne(id)
		const data = await this.careers.update({
			where: { id },
			data: updateCareerDto,
			select: {
				id: true,
				name: true,
				program: true,
			},
		})
		return TransformResponse.map(data, 'Carrera actualizada con éxito!!', 'PUT')
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.careers.update({
			where: { id },
			data: { available: false },
			select: {
				id: true,
				name: true,
				program: true,
			},
		})
		return TransformResponse.map(
			data,
			'Carrera eliminada con éxito!!',
			'DELETE',
		)
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: ICareerWhere = {
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
