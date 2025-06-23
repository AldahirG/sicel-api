import { TransformResponse } from 'src/common/mappers/transform-response'
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common'
import { ICommentWhere } from './interfaces/comment-where.interface'
import { FilterCommentDto } from '../grades/dto/filter-comments.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class CommentsService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createCommentDto: CreateCommentDto) {
		const data = await this.comments.create({
			data: createCommentDto,
		})
		return TransformResponse.map(
			data,
			'Comentario creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: FilterCommentDto) {
		const filter = this.getParams(params)
		const totalRows = await this.comments.count({ where: filter.where })

		const data = await this.comments.findMany({
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

	async update(id: string, updateCommentDto: UpdateCommentDto) {
		const data = await this.comments.update({
			where: { id },
			data: updateCommentDto,
		})
		return TransformResponse.map(
			data,
			'Comentario actualizado con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		const data = await this.comments.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			data,
			'Comentario eliminado con éxito!!',
			'DELETE',
		)
	}

	getParams(params: FilterCommentDto): ICommentWhere {
		const { page, 'per-page': perPage, paginated } = params

		const condition: ICommentWhere = {
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
