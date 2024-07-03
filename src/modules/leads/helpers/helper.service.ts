import { Leads, Prisma, PrismaClient } from '@prisma/client'
import { HttpException, HttpStatus, OnModuleInit } from '@nestjs/common'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { ILeadWhere } from '../interfaces/lead-where.interface'
import { CreateTimeLineDto } from 'src/common/dto/time-line.dto'
import { LeadMapper } from '../interfaces/lead-mapper.interface'

export class HelperService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	select(): Prisma.LeadsSelect {
		return {
			id: true,
			grade: true,
			dateContact: true,
			reference: true,
			scholarship: true,
			Cycle: {
				select: { id: true, name: true, cycle: true },
			},
			semester: true,
			information: {
				select: {
					name: true,
					genre: true,
					careerInterest: true,
					formerSchool: true,
					typeSchool: true,
					enrollmentStatus: true,
					followUp: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			campaign: true,
			asetName: true,
			user: {
				select: {
					id: true,
					name: true,
					paternalSurname: true,
					maternalSurname: true,
					email: true,
				},
			},
			city: {
				select: {
					name: true,
					state: {
						select: {
							name: true,
							country: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
			phones: true,
			emails: true,
			createAt: true,
			updateAt: true,
		}
	}

	getParams(params: PaginationFilterDto): ILeadWhere {
		const { page, 'per-page': perPage, paginated } = params

		const condition: ILeadWhere = {
			where: { available: true },
			orderBy: [{ id: 'desc' }],
		}

		if (paginated) {
			condition.skip = (page - 1) * perPage
			condition.take = perPage
		}
		return condition
	}

	async fillTimeLine(createTimeLine: CreateTimeLineDto) {
		return await this.timeLineLeads.create({
			data: createTimeLine,
		})
	}

	validateLead(lead: LeadMapper, userId: string) {
		if (lead.promoter.id) {
			throw new HttpException(
				`El lead ya a sido asignado a un promotor`,
				HttpStatus.CONFLICT,
			)
		}

		if (lead.promoter.id == userId) {
			throw new HttpException(
				`Este led no se puede asignar al mismo promotor`,
				HttpStatus.CONFLICT,
			)
		}

		if (lead.dateContact && lead.information.followUp) {
			throw new HttpException(
				`Este lead no se puede reasignar`,
				HttpStatus.CONFLICT,
			)
		}
	}

	getMessages(lead: LeadMapper) {
		if (lead.promoter.id || lead.dateContact && lead.information.followUp) {
			return {
				timeLineMessage: 'Resignación de lead',
				response: 'El lead a sido reasignado correctamente!!'
			}
		}
		return {
			timeLineMessage: 'Asignación de lead',
			response: 'El lead a sido asignado correctamente!!'
		}
	}
}
