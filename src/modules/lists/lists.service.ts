import {
	Injectable,
	OnModuleInit,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateListDto } from './dto/create-list.dto'
import { UpdateListDto } from './dto/update-list.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'

@Injectable()
export class ListsService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createListDto: CreateListDto) {
		console.log('DTO recibido:', createListDto) // 👀

		const data = await this.lists.create({
			data: createListDto,
		})

		return TransformResponse.map(
			data,
			'Lista creada con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)
		const totalRows = await this.lists.count({ where: filter.where })

		const data = await this.lists.findMany(filter)

		return TransformResponse.map({
			data,
			meta: params.paginated
				? {
						currentPage: params.page,
						nextPage:
							Math.ceil(totalRows / params['per-page']) === params.page
								? null
								: params.page + 1,
						totalPages: Math.ceil(totalRows / params['per-page']),
						perPage: params['per-page'],
						totalRecords: totalRows,
						prevPage: params.page === 1 ? null : params.page - 1,
					}
				: undefined,
		})
	}

	async findOne(id: string) {
		const data = await this.lists.findFirst({
			where: {
				id,
				available: true,
			},
		})

		if (!data) {
			throw new HttpException(
				`Lista no encontrada con ID ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}

		return TransformResponse.map(data)
	}

	async update(id: string, updateListDto: UpdateListDto) {
		await this.findOne(id) // validación previa

		const data = await this.lists.update({
			where: { id },
			data: updateListDto,
		})

		return TransformResponse.map(data, 'Lista actualizada con éxito!!', 'PUT')
	}

	async remove(id: string) {
		await this.findOne(id) // validación previa

		const data = await this.lists.update({
			where: { id },
			data: { available: false },
		})

		return TransformResponse.map(data, 'Lista eliminada con éxito!!', 'DELETE')
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: any = {
			where: { available: true },
			orderBy: [{ createAt: 'desc' }],
		}

		if (paginated) {
			condition.skip = (page - 1) * perPage
			condition.take = perPage
		}

		return condition
	}
}
