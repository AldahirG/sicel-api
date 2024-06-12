import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'
import { HelperService } from './helpers/helper.service'
import { LeadResource } from './mapper/lead.mapper'
import { ProcessFileService } from '../process-file/process-file.service'
import { CsvInterface } from './interfaces/csv.interface'
import { FilterLeadDto } from './dto/filter-lead.dto'

@Injectable()
export class LeadsService extends HelperService {
	constructor(private readonly csvService: ProcessFileService) {
		super()
	}

	async create(createLeadDto: CreateLeadDto, user) {
		const select = this.select()
		const {
			information,
			campaignId,
			gradeId,
			asetNameId,
			cityId,
			userId,
			cycleId,
			reference,
			email,
			phone,
			...leadData
		} = createLeadDto

		const campaignConnect = campaignId
			? { connect: { id: campaignId } }
			: undefined
		const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined
		const assetNameConnect = asetNameId
			? { connect: { id: asetNameId } }
			: undefined
		const cityConnect = cityId ? { connect: { id: cityId } } : undefined
		const emails = email
			? { createMany: { data: email.map((i) => ({ email: i })) } }
			: undefined
		const phones = phone
			? { createMany: { data: phone.map((i) => ({ telephone: i })) } }
			: undefined
		const cycleConnect = cycleId ? { connect: { id: cycleId } } : undefined
		const assignLead = user.roles.some((assignment) => assignment.roleId === 2)
			? { connect: { id: user.id } }
			: undefined

		const lead = await this.leads.create({
			data: {
				...leadData,
				campaign: campaignConnect,
				asetName: assetNameConnect,
				grade: gradeConnect,
				user: assignLead,
				city: cityConnect,
				Cycle: cycleConnect,
				reference: {
					create: reference,
				},
				information: {
					create: information,
				},
				emails,
				phones,
			},
			select,
		})
		return TransformResponse.map(
			LeadResource.map(lead),
			'Lead creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const select = this.select()
		const filter = this.getParams(params)
		const totalRows = await this.leads.count({ where: filter.where })

		const data = await this.leads.findMany({
			...filter,
			select,
		})

		return TransformResponse.map({
			data: LeadResource.collection(data),
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

	async findOne(id: string, params: FilterLeadDto = { 'with-timeline': false, comments: false }) {
		const { "with-timeline": withTimeline, comments } = params
		let timeline = null
		const select = this.select()
		const data = await this.leads.findFirst({
			where: { id, available: true },
			select,
		})
		if (withTimeline) {
			timeline = await this.timeLineLeads.findMany({ where: { leadId: id, timeableModel: comments ? undefined : 'User' } })
		}

		if (!data) {
			throw new HttpException(
				`Lead not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map({ ...LeadResource.map(data), meta: timeline ? { timeline: timeline } : undefined })
	}

	async update(id: string, updateLeadDto: UpdateLeadDto, user: any) {
		const { data: lead } = await this.findOne(id)
		const select = this.select()
		const {
			information,
			campaignId,
			gradeId,
			asetNameId,
			cityId,
			userId,
			cycleId,
			reference,
			email,
			phone,
			...leadData
		} = updateLeadDto

		const campaignConnect = campaignId
			? { connect: { id: campaignId } }
			: undefined
		const asetNameConnect = asetNameId
			? { connect: { id: asetNameId } }
			: undefined
		const cycleConnect = cycleId ? { connect: { id: cycleId } } : undefined
		const userConnect = userId ? { connect: { id: userId } } : undefined
		const cityConnect = cityId ? { connect: { id: cityId } } : undefined
		const emails = email
			? { createMany: { data: email.map((i) => ({ email: i })) } }
			: undefined
		const phones = phone
			? { createMany: { data: phone.map((i) => ({ telephone: i })) } }
			: undefined
		const referenceData = reference
			? { upsert: { create: reference, update: reference } }
			: undefined
		const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined

		if (!lead.dateContact) {
			this.fillTimeLine({
				title: 'Primer Contacto',
				description: '',
				timeableId: user.id,
				timeableModel: 'User',
				leadId: id,
			})
			leadData.dateContact = new Date()
		}

		const updateLead = await this.leads.update({
			where: { id },
			data: {
				...leadData,
				campaign: campaignConnect,
				asetName: asetNameConnect,
				user: userConnect,
				city: cityConnect,
				grade: gradeConnect,
				reference: referenceData,
				Cycle: cycleConnect,
				information: {
					upsert: {
						create: information,
						update: information,
					},
				},
				emails: {
					deleteMany: {},
					...emails,
				},
				phones: {
					deleteMany: {},
					...phones,
				},
			},
			select,
		})
		return TransformResponse.map(
			LeadResource.map(updateLead),
			'Lead actualizado con éxito!!',
			'PUT',
			HttpStatus.OK,
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.leads.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(data, 'Lead eliminado con éxito!!', 'DELETE')
	}

	async assignment(id: string, userId: string) {
		const select = this.select()
		const { data: lead } = await this.findOne(id)
		if (lead.promoter.id) {
			throw new HttpException(
				`El lead ya a sido asignado a un promotor`,
				HttpStatus.CONFLICT,
			)
		}
		const data = await this.leads.update({
			where: { id },
			data: {
				user: {
					connect: { id: userId },
				},
			},
			select,
		})
		return TransformResponse.map(
			LeadResource.map(data),
			'El lead a sido asignado correctamente!!',
			'PUT',
		)
	}

	async CreateFromFileShare(file: Express.Multer.File) {
		const select = this.select()
		const data: Array<CsvInterface> = await this.csvService.readCsv(file)
		const newLeads = await Promise.all(
			data.map(async (data) => {
				const { asetName, grade, promotor, ...leadData } = data

				const { id: asetId } = asetName
					? await this.asetName.findFirst({
						where: { name: { contains: asetName } },
					})
					: undefined

				const { id: gradeId } = grade
					? await this.grades.findFirst({
						where: { name: { contains: grade } },
					})
					: undefined

				const asetNameConnect = asetId ? { connect: { id: asetId } } : undefined
				const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined

				const lead = await this.leads.create({
					data: {
						...leadData,
						asetName: asetNameConnect,
						grade: gradeConnect,
					},
					select,
				})
				return lead
			}),
		)

		return TransformResponse.map(
			newLeads,
			'Lead creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async reassignment(leadId: string, userId: string, user: any) {
		const select = this.select()
		const { data: lead } = await this.findOne(leadId)
		if (lead.promoter.id == userId) {
			throw new HttpException(
				`Este led no se puede asignar al mismo promotor`,
				HttpStatus.BAD_REQUEST,
			)
		}

		if (lead.dateContact && lead.information.followUp) {
			throw new HttpException(
				`Este lead no se puede reasignar`,
				HttpStatus.BAD_REQUEST,
			)
		}

		const data = await this.leads.update({
			where: { id: leadId },
			data: {
				user: {
					connect: { id: userId },
				},
			},
			select,
		})
		this.fillTimeLine({
			title: 'Resignación de lead',
			description: '',
			timeableId: user.id,
			timeableModel: 'User',
			leadId: leadId,
		})
		return TransformResponse.map(
			LeadResource.map(data),
			'El lead a sido reasignado correctamente!!',
			'PUT',
		)
	}
}
