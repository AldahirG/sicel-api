import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { CreateCountryDto } from './dto/create-country.dto'
import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { ICountryWhere } from './interfaces/country-where.interface'

@Injectable()
export class CountriesService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createCountryDto: CreateCountryDto) {
		const data = await this.countries.create({
			data: createCountryDto,
			select: {
				id: true,
				name: true,
			},
		})
		return TransformResponse.map(
			data,
			'País creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.countries.count({ where: filter.where })

		const data = await this.countries.findMany({
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
		const data = await this.countries.findFirst({
			where: { id, available: true },
			select: {
				id: true,
				name: true,
			},
		})
		if (!data) {
			throw new HttpException(
				`Country not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.countries.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(data, 'País eliminado con éxito!!', 'DELETE')
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: ICountryWhere = {
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
