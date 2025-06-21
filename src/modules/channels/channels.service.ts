import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { CreateChannelDto } from './dto/create-channel.dto'
import { UpdateChannelDto } from './dto/update-channel.dto'
import { PrismaClient } from '@prisma/client'
import { IChannelWhere } from './interfaces/channel-where.interface'

@Injectable()
export class ChannelsService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createChannelDto: CreateChannelDto) {
		const data = await this.channels.create({
			data: createChannelDto,
		})
		return TransformResponse.map(
			data,
			'Canal de venta creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const filter = this.getParams(params)

		const totalRows = await this.channels.count({ where: filter.where })

		const data = await this.channels.findMany({
			...filter,
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
		const data = await this.channels.findFirst({
			where: { id, available: true },
		})
		if (!data) {
			throw new HttpException(
				`Canal de venta no encontrado con id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
	}

	async update(id: string, updateChannelDto: UpdateChannelDto) {
		await this.findOne(id)
		const data = await this.channels.update({
			where: { id },
			data: updateChannelDto,
		})
		return TransformResponse.map(data, 'Canal de venta actualizado con éxito!!', 'PUT')
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.channels.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			data,
			'Canal de venta eliminado con éxito!!',
			'DELETE',
		)
	}

	private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: IChannelWhere = {
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
