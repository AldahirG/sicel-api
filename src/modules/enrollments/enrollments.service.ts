import {
	Injectable,
	OnModuleInit,
	HttpStatus,
	HttpException,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import * as ExcelJS from 'exceljs'
import { Response } from 'express'

@Injectable()
export class EnrollmentsService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createEnrollmentDto: CreateEnrollmentDto) {
		const { leadId } = createEnrollmentDto

		const lead = await this.leads.findUnique({ where: { id: leadId } })
		if (!lead) {
			throw new HttpException('Lead no encontrado', HttpStatus.NOT_FOUND)
		}

		const existing = await this.enrollments.findFirst({ where: { leadId } })
		if (existing) {
			throw new HttpException(
				'Este lead ya tiene una inscripción registrada.',
				HttpStatus.CONFLICT,
			)
		}

		const enrollment = await this.enrollments.create({
			data: {
				...createEnrollmentDto,
			},
		})

		return TransformResponse.map(
			enrollment,
			'Inscripción registrada con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const baseFilter = {
			where: { available: true },
			orderBy: [{ createAt: 'desc' }],
			include: {
				Lead: {
					include: {
						user: true, // 👈 correcto
						information: true,
						phones: true,
						emails: true,
					},
				},
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		}

		const filter: any = { ...baseFilter }

		if (paginated) {
			filter.skip = (page - 1) * perPage
			filter.take = perPage
		}

		const total = await this.enrollments.count({ where: baseFilter.where })
		const data = await this.enrollments.findMany(filter)

		return TransformResponse.map({
			data,
			meta: paginated
				? {
						currentPage: page,
						nextPage: page * perPage >= total ? null : page + 1,
						totalPages: Math.ceil(total / perPage),
						perPage,
						totalRecords: total,
						prevPage: page === 1 ? null : page - 1,
					}
				: undefined,
		})
	}

	async findOne(id: string) {
		const data = await this.enrollments.findFirst({
			where: { id, available: true },
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		})

		if (!data) {
			throw new HttpException('Inscripción no encontrada', HttpStatus.NOT_FOUND)
		}

		return TransformResponse.map(data)
	}

	async update(id: string, dto: UpdateEnrollmentDto) {
		await this.findOne(id) // Asegura que exista antes de actualizar

		const data = await this.enrollments.update({
			where: { id },
			data: {
				careersId: dto.careersId,
				promotionId: dto.promotionId,
				channelId: dto.channelId,
				listId: dto.listId,
				leadId: dto.leadId,
				enrollment_folio: dto.enrollment_folio,
				matricula: dto.matricula,
				scholarship: dto.scholarship,
				curp: dto.curp, // <- corregido: minúsculas
				comments: dto.comments, // <- corregido: minúsculas
			},
		})

		return TransformResponse.map(
			data,
			'Inscripción actualizada con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.enrollments.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			data,
			'Inscripción eliminada con éxito!!',
			'DELETE',
		)
	}

	// 🚀 Servicios para usuarios autenticados (por userId)
	async findAllByUser(userId: string, params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const baseFilter = {
			where: {
				available: true,
				Lead: {
					userId,
				},
			},
			orderBy: [{ createAt: 'desc' }],
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		}

		const filter: any = { ...baseFilter }

		if (paginated) {
			filter.skip = (page - 1) * perPage
			filter.take = perPage
		}

		const total = await this.enrollments.count({ where: baseFilter.where })
		const data = await this.enrollments.findMany(filter)

		return TransformResponse.map({
			data,
			meta: paginated
				? {
						currentPage: page,
						nextPage: page * perPage >= total ? null : page + 1,
						totalPages: Math.ceil(total / perPage),
						perPage,
						totalRecords: total,
						prevPage: page === 1 ? null : page - 1,
					}
				: undefined,
		})
	}

	async findOneByUser(userId: string, enrollmentId: string) {
		const data = await this.enrollments.findFirst({
			where: {
				id: enrollmentId,
				available: true,
				Lead: {
					userId,
				},
			},
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		})

		if (!data) {
			throw new HttpException(
				'Inscripción no encontrada para este usuario.',
				HttpStatus.NOT_FOUND,
			)
		}

		return TransformResponse.map(data)
	}

	async exportToExcel(res: Response) {
		const enrollments = await this.enrollments.findMany({
			where: { available: true },
			include: {
				Career: true,
				Promotion: true,
				Channel: true,
				List: true,
				Payments: true,
				Lead: {
					include: {
						user: true,
						information: {
							include: {
								followUp: true,
							},
						},
						emails: true,
						phones: true,
						city: {
							include: {
								state: {
									include: {
										country: true,
									},
								},
							},
						},
						campaign: true,
						asetName: {
							include: {
								contactType: true,
							},
						},
						reference: true,
						grade: true,
						Cycle: true,
					},
				},
			},
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Inscripciones')

		worksheet.columns = [
			{ header: 'Nombre', key: 'name', width: 25 },
			{ header: 'Correo', key: 'email', width: 30 },
			{ header: 'Teléfono', key: 'phone', width: 20 },
			{ header: 'Folio', key: 'folio', width: 20 },
			{ header: 'Matrícula', key: 'matricula', width: 15 },
			{ header: 'CURP', key: 'curp', width: 20 },
			{ header: 'Carrera', key: 'career', width: 30 },
			{ header: 'Promoción', key: 'promotion', width: 30 },
			{ header: 'Canal', key: 'channel', width: 20 },
			{ header: 'Lista', key: 'list', width: 15 },
			{ header: 'Beca', key: 'scholarship', width: 10 },
			{ header: 'Seguimiento', key: 'followUp', width: 25 },
			{ header: 'País', key: 'country', width: 20 },
			{ header: 'Estado', key: 'state', width: 20 },
			{ header: 'Ciudad', key: 'city', width: 20 },
			{ header: 'Ciclo', key: 'cycle', width: 15 },
			{ header: 'Asset Name', key: 'assetName', width: 30 },
			{ header: 'Campaña', key: 'campaign', width: 30 },
			{ header: 'Medio de contacto', key: 'contactType', width: 25 },
			{ header: 'Tipo referido', key: 'referenceType', width: 25 },
			{ header: 'Nombre referido', key: 'referenceName', width: 30 },
			{ header: 'Pago concepto', key: 'paymentConcept', width: 30 },
			{ header: 'Pago monto', key: 'paymentAmount', width: 15 },
		]

		for (const e of enrollments) {
			const lead = e.Lead
			worksheet.addRow({
				name: lead?.information?.name || '',
				email: lead?.emails?.[0]?.email || '',
				phone: lead?.phones?.[0]?.telephone || '',
				folio: e.enrollment_folio || '',
				matricula: e.matricula || '',
				curp: e.curp || '',
				career: e.Career?.name || '',
				promotion: e.Promotion?.name || '',
				channel: e.Channel?.name || '',
				list: e.List?.noLista || '',
				scholarship: e.scholarship || '',
				followUp: lead?.information?.followUp?.name || '',
				country: lead?.city?.state?.country?.name || '',
				state: lead?.city?.state?.name || '',
				city: lead?.city?.name || '',
				cycle: lead?.Cycle?.cycle || '',
				assetName: lead?.asetName?.name || '',
				campaign: lead?.campaign?.name || '',
				contactType: lead?.asetName?.contactType?.name || '',
				referenceType: lead?.reference?.type || '',
				referenceName: lead?.reference?.name || '',
				paymentConcept: e.Payments?.documentNumber || '',
				paymentAmount: e.Payments?.amount || '',
			})
		}

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=inscripciones.xlsx',
		)

		await workbook.xlsx.write(res)
		res.end()
	}

	async exportToExcelByList(res: Response, listId: string) {
		const allPayments = await this.payments.findMany({
			where: { available: true },
		})
		const paidEnrollmentIds = new Set(allPayments.map((p) => p.enrollmentId))

		const list = await this.lists.findUnique({ where: { id: listId } })
		const noLista = list?.noLista || 'SIN NOMBRE'

		const enrollments = await this.enrollments.findMany({
			where: { available: true, listId },
			include: {
				Career: true,
				Lead: {
					include: {
						user: true,
						information: true,
						Cycle: true,
					},
				},
			},
		})

		const workbook = new ExcelJS.Workbook()
		const sheetPagados = workbook.addWorksheet('REGISTROS PAGADOS')
		const sheetNoPagados = workbook.addWorksheet('REGISTROS NO PAGADOS')

		const columns = [
			{ header: 'PROMOTOR', key: 'promoter', width: 25 },
			{ header: 'FECHA INSCRIPCION', key: 'fecha', width: 20 },
			{ header: 'NOMBRE PROSPECTO', key: 'nombre', width: 30 },
			{ header: 'STATUS', key: 'status', width: 15 },
			{ header: 'CICLO ESCOLAR', key: 'ciclo', width: 20 },
			{ header: 'PROGRAMA A INGRESAR', key: 'programa', width: 25 },
			{ header: 'OBSERVACIONES', key: 'observaciones', width: 35 },
			{ header: 'ESTATUS DE PAGO', key: 'estatus', width: 15 },
		]

		const pastelGreen = 'FFE6F4EA' // verde pastel
		const pastelRed = 'FFFDEAEA' // rojo pastel
		const pastelBlue = 'FFEAF1FB' // encabezado suave

		const setupSheet = (sheet, isPagado) => {
			sheet.columns = columns
			sheet.mergeCells('A1:H1')
			sheet.getCell('A1').value = `LISTA ${noLista} - ${sheet.name}`
			sheet.getCell('A1').font = { bold: true, size: 14 }
			sheet.getCell('A1').alignment = { horizontal: 'center' }
			sheet.getCell('A1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: isPagado ? pastelGreen : pastelRed },
			}

			const headerRow = sheet.getRow(2)
			headerRow.values = columns.map((col) => col.header)
			headerRow.font = { bold: true }
			headerRow.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: pastelBlue },
			}
			headerRow.alignment = { horizontal: 'center' }
		}

		setupSheet(sheetPagados, true)
		setupSheet(sheetNoPagados, false)

		const pagadoRows = []
		const noPagadoRows = []

		for (const e of enrollments) {
			const user = e.Lead?.user
			const info = e.Lead?.information

			const row = {
				promoter: user ? `${user.name} ${user.paternalSurname ?? ''}` : '',
				fecha: e.createAt.toISOString().split('T')[0],
				nombre: info?.name || '',
				status: info?.enrollmentStatus || '',
				ciclo: e.Lead?.Cycle?.cycle || '',
				programa: e.Career?.program || '',
				observaciones: e.comments || '',
				estatus: paidEnrollmentIds.has(e.id) ? 'PAGADO' : 'SIN PAGO',
			}

			if (paidEnrollmentIds.has(e.id)) {
				pagadoRows.push(row)
			} else {
				noPagadoRows.push(row)
			}
		}

		sheetPagados.addRows(pagadoRows, 'i+2')
		sheetNoPagados.addRows(noPagadoRows, 'i+2')

		const applyBorders = (sheet) => {
			sheet.eachRow({ includeEmpty: false }, (row) => {
				row.eachCell({ includeEmpty: false }, (cell) => {
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					}
					cell.alignment = { vertical: 'middle', wrapText: true }
				})
			})
		}
		applyBorders(sheetPagados)
		applyBorders(sheetNoPagados)

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=lista-inscripciones.xlsx',
		)

		await workbook.xlsx.write(res)
		res.end()
	}
}
