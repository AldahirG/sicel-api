import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { CreateGradeDto } from './dto/create-grade.dto'
import { UpdateGradeDto } from './dto/update-grade.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { PrismaClient } from '@prisma/client'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { IGradeWhere } from './interfaces/grades-where.interface'

@Injectable()
export class GradesService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createGradeDto: CreateGradeDto) {
		const data = await this.grades.create({
			data: createGradeDto,
		})
		return TransformResponse.map(
			data,
			'Escolaridad creada con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.grades.count({ where: filter.where })

		const data = await this.grades.findMany({
			...filter,
			select: {
				id: true,
				name: true,
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
		const data = await this.grades.findFirst({
			where: { id, available: true },
			select: {
				id: true,
				name: true,
			},
		})
		if (!data) {
			throw new HttpException(
				`Grade not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async update(id: string, updateGradeDto: UpdateGradeDto) {
		await this.findOne(id)
		const data = await this.grades.update({
			where: { id },
			data: updateGradeDto,
			select: {
				id: true,
				name: true,
			},
		})
		return TransformResponse.map(
			data,
			'Escolaridad actualizada con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.grades.update({
			where: { id },
			data: { available: false },
			select: {
				id: true,
				name: true,
			},
		})
		return TransformResponse.map(
			data,
			'Escolaridad eliminada con éxito!!',
			'DELETE',
		)
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: IGradeWhere = {
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
