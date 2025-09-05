import { TransformResponse } from 'src/common/mappers/transform-response'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'
import { HelperService } from './helpers/helper.service'
import { LeadResource } from './mapper/lead.mapper'
import { ProcessFileService } from '../process-file/process-file.service'
import { CsvInterface } from './interfaces/csv.interface'
import { validate as isUUID } from 'uuid'
import { FilterLeadDto } from './dto/filter-lead.dto'
import { UpdatePromotorDto } from './dto/update-promotor.dto'
import { LeadsFilterDto } from '../../common/dto/leads-filter.dto'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class LeadsService extends HelperService {
	prisma: PrismaClient // ✅ Declaración explícita

	constructor(private readonly csvService: ProcessFileService) {
		super()
		this.prisma = new PrismaClient() // ✅ Inicialización
	}

	private async checkPhonesAreUnique(
		phoneArray: string[],
		leadIdToExclude?: string,
	) {
		if (!phoneArray || phoneArray.length === 0) return

		const duplicates = await this.prisma.phones.findMany({
			where: {
				telephone: {
					in: phoneArray,
				},
				...(leadIdToExclude && {
					lead: {
						NOT: {
							id: leadIdToExclude,
						},
					},
				}),
			},
		})

		if (duplicates.length > 0) {
			throw new HttpException(
				'El número de teléfono ya está registrado.',
				HttpStatus.BAD_REQUEST,
			)
		}
	}

	private async checkEmailsAreUnique(
		emailArray: string[],
		leadIdToExclude?: string,
	) {
		if (!emailArray || emailArray.length === 0) return // ⚠️ prevención

		if (!emailArray || emailArray.length === 0) return

		const duplicates = await this.prisma.emails.findMany({
			where: {
				email: { in: emailArray },
				...(leadIdToExclude && {
					lead: {
						NOT: {
							id: leadIdToExclude,
						},
					},
				}),
			},
		})

		if (duplicates.length > 0) {
			throw new HttpException(
				'El correo electrónico ya está registrado.',
				HttpStatus.BAD_REQUEST,
			)
		}
	}

	// Crear Lead
	// Crear Lead
	async create(createLeadDto: CreateLeadDto, user) {
		try {
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
				program,
  				intern,
				...leadData
			} = createLeadDto

			// 🚫 Validar contacto obligatorio
			if ((!email || email.length === 0) && (!phone || phone.length === 0)) {
				throw new HttpException(
					'Debe proporcionar al menos un correo electrónico o un número de teléfono.',
					HttpStatus.BAD_REQUEST,
				)
			}

			// ✅ Validación de duplicados
			if (email?.length > 0) {
				await this.checkEmailsAreUnique(email)
			}
			if (phone?.length > 0) {
				await this.checkPhonesAreUnique(phone)
			}

			// 🔗 Relaciones
			const campaignConnect = campaignId
				? { connect: { id: campaignId } }
				: undefined
			const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined
			const assetNameConnect = asetNameId
				? { connect: { id: asetNameId } }
				: undefined
			const cityConnect = cityId ? { connect: { id: cityId } } : undefined
			const cycleConnect = cycleId ? { connect: { id: cycleId } } : undefined

			// 👤 Asignación de usuario según rol
			const isPromotor = user.roles?.some((r) => r.name?.toUpperCase?.() === 'PROMOTOR' || r.role?.name?.toUpperCase?.() === 'PROMOTOR'
			);
			
			const assignedUser = isPromotor
  			? { connect: { id: user.id } }
  			: userId
  			  ? { connect: { id: userId } }
  			  : undefined;

			// 📞📧 Relaciones múltiples
			const emails = email?.length
				? { createMany: { data: email.map((i) => ({ email: i })) } }
				: undefined

			const phones = phone?.length
				? { createMany: { data: phone.map((i) => ({ telephone: i })) } }
				: undefined

			// 🧾 Crear registro
			const lead = await this.leads.create({
				data: {
					...leadData,
					dateContact: createLeadDto.dateContact,
					campaign: campaignConnect,
					asetName: assetNameConnect,
					grade: gradeConnect,
					user: assignedUser,
					city: cityConnect,
					Cycle: cycleConnect,
					reference: { create: reference },
					information: { create: information },
					emails,
					phones,
					program,
  					intern,
				},
				select,
			})

			return TransformResponse.map(
				LeadResource.map(lead),
				'Lead creado con éxito!!',
				'POST',
				HttpStatus.CREATED,
			)
		} catch (error) {
			console.error('Error al crear el lead en el backend:', error)
			throw new Error(error.message || 'Error desconocido al crear el lead')
		}
	}

	// Crear Lead por Promotor
	async createForPromoter(createLeadDto: CreateLeadDto, user) {
		try {
			// Desestructuración de los datos recibidos en el DTO
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

			// Validación para asegurarse de que el promotor está creando el lead
			const assignLead =
				!userId && user.roles.some((assignment) => assignment.role?.id === 2)
					? { connect: { id: user.id } }
					: userId
						? { connect: { id: userId } }
						: undefined

			// Configurar las relaciones con otras entidades si están presentes
			const campaignConnect = campaignId
				? { connect: { id: campaignId } }
				: undefined
			const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined
			const assetNameConnect = asetNameId
				? { connect: { id: asetNameId } }
				: undefined
			const cityConnect = cityId ? { connect: { id: cityId } } : undefined
			const cycleConnect = cycleId ? { connect: { id: cycleId } } : undefined
			const emails = email
				? { createMany: { data: email.map((i) => ({ email: i })) } }
				: undefined
			const phones = phone
				? { createMany: { data: phone.map((i) => ({ telephone: i })) } }
				: undefined

			// Crear el lead en la base de datos, asociando correctamente al promotor (si es necesario)
			const lead = await this.leads.create({
				data: {
					...leadData,
					campaign: campaignConnect,
					asetName: assetNameConnect,
					grade: gradeConnect,
					user: assignLead, // Asignar el userId del promotor logueado
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
			console.log('Usuario recibido:', JSON.stringify(user, null, 2))

			return TransformResponse.map(
				LeadResource.map(lead),
				'Lead creado con éxito!!',
				'POST',
				HttpStatus.CREATED,
			)
		} catch (error) {
			console.error('Error al crear el lead en el backend:', error) // Log para errores
			throw new Error(error.message || 'Error desconocido al crear el lead')
		}
	}

	// Obtener todos los leads con filtros
	async findAll(params: FilterLeadDto) {
		const select = this.select()
		const filter = this.getParams(params)

		// Si el filtro de followUp está presente, añadir el filtro correspondiente
		if (params.followUp) {
			filter.where = {
				...filter.where,
				information: {
					followUp: {
						name: params.followUp, // El filtro debería coincidir con el campo "followUp"
					},
				},
			}
		}

		const totalRows = await this.leads.count({ where: filter.where })

		const data = await this.leads.findMany({
			...filter,
			select,
			orderBy: { createAt: 'desc' },
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

	// Obtener un lead por ID
	async findOne(
		id: string,
		params = { 'with-timeline': false, comments: false },
	) {
		const { 'with-timeline': withTimeline, comments } = params
		let timeline = null

		const data = await this.leads.findFirst({
			where: { id, available: true },
			select: this.select(), // ✅ Asegúrate de usar el método select() del helper
		})

		if (!data) {
			throw new HttpException(
				`Lead not found with id ${id}`,
				HttpStatus.NOT_FOUND,
			)
		}

		if (withTimeline) {
			timeline = await this.timeLineLeads.findMany({
				where: { leadId: id, timeableModel: comments ? undefined : 'User' },
			})
		}

		if (comments) {
			timeline = await this.comments.findMany({
				where: { leadId: id },
				orderBy: { createAt: 'desc' },
			})
		}

		return TransformResponse.map({
			...LeadResource.map(data),
			meta: timeline ? { timeline: timeline } : undefined,
		})
	}

	// Actualizar un lead
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
			program,
  			intern,

			...leadData
		} = updateLeadDto

		// 🚫 Validar que haya al menos un email o teléfono
		if ((!email || email.length === 0) && (!phone || phone.length === 0)) {
			throw new HttpException(
				'Debe proporcionar al menos un correo electrónico o un número de teléfono.',
				HttpStatus.BAD_REQUEST,
			)
		}

		// ✅ Validaciones únicas excluyendo el lead actual
		if (email && email.length > 0) {
			await this.checkEmailsAreUnique(email, id)
		}

		if (phone && phone.length > 0) {
			await this.checkPhonesAreUnique(phone, id)
		}

		// 🔗 Conexiones
		const campaignConnect = campaignId
			? { connect: { id: campaignId } }
			: undefined
		const asetNameConnect = asetNameId
			? { connect: { id: asetNameId } }
			: undefined
		const cycleConnect = cycleId ? { connect: { id: cycleId } } : undefined
		const userConnect = userId ? { connect: { id: userId } } : undefined
		const cityConnect = cityId ? { connect: { id: cityId } } : undefined
		const referenceData = reference
			? { upsert: { create: reference, update: reference } }
			: undefined
		const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined

		// 📞📧 Emails y teléfonos
		const emails =
			email?.length > 0
				? {
						deleteMany: {},
						createMany: { data: email.map((i) => ({ email: i })) },
					}
				: { deleteMany: {} }

		const phones =
			phone?.length > 0
				? {
						deleteMany: {},
						createMany: { data: phone.map((i) => ({ telephone: i })) },
					}
				: { deleteMany: {} }

		// 🕒 Primer contacto (timeline)
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

		// 🔄 Actualizar el lead
		const updateLead = await this.leads.update({
			where: { id },
			data: {
				...leadData,
				program: program,
				intern: intern, 
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
				emails,
				phones,
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

	// Eliminar un lead
	async remove(id: string) {
		await this.findOne(id)
		const data = await this.leads.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(data, 'Lead eliminado con éxito!!', 'DELETE')
	}

	// Asignación de promotor
	async assignment(id: string, userId: string) {
		const select = this.select()
		const { data: lead } = await this.findOne(id)
		this.validateLead(lead, userId)
		const { timeLineMessage, response } = this.getMessages(lead)
		const data = await this.leads.update({
			where: { id },
			data: {
				user: {
					connect: { id: userId },
				},
			},
			select,
		})

		this.fillTimeLine({
			title: timeLineMessage,
			description: '',
			timeableId: userId,
			timeableModel: 'User',
			leadId: lead.id,
		})

		return TransformResponse.map(LeadResource.map(data), response, 'PUT')
	}

	// Crear Leads desde archivo CSV
	async CreateFromFileShare(file: Express.Multer.File) {
		const select = this.select()
		const data: CsvInterface[] = await this.csvService.readCsv(file)

		const newLeads = []

		for (const row of data) {
			// Extraer teléfono y correo desde createMany
			const phone = row.phones?.createMany?.data?.[0]?.telephone?.trim()
			const email = row.emails?.createMany?.data?.[0]?.email?.trim()

			const emailArray = email ? [email] : []
			const phoneArray = phone ? [phone] : []

			// Verificación válida
			if (emailArray.length === 0 && phoneArray.length === 0) {
				console.warn(
					`Lead omitido: sin teléfono ni correo (${JSON.stringify(row)})`,
				)
				continue
			}

			try {
				if (emailArray.length > 0) {
					await this.checkEmailsAreUnique(emailArray)
				}
				if (phoneArray.length > 0) {
					await this.checkPhonesAreUnique(phoneArray)
				}

				const lead = await this.leads.create({
					data: {
						...row,
						emails:
							emailArray.length > 0
								? {
										createMany: {
											data: emailArray.map((email) => ({ email })),
										},
									}
								: undefined,
						phones:
							phoneArray.length > 0
								? {
										createMany: {
											data: phoneArray.map((tel) => ({ telephone: tel })),
										},
									}
								: undefined,
					},
					select,
				})

				newLeads.push(lead)
			} catch (error) {
				console.warn(
					`Lead omitido por duplicado (${email || phone}): ${error.message}`,
				)
			}
		}

		return TransformResponse.map(
			newLeads,
			`${newLeads.length} lead(s) creados con éxito. Registros duplicados o vacíos fueron omitidos.`,
			'POST',
			HttpStatus.CREATED,
		)
	}

	// Actualizar Promotor en múltiples leads
	async updatePromotor(data: UpdatePromotorDto) {
		const { leads, promotor } = data
		const leadsData = await Promise.all(
			leads.map(async (e) => {
				try {
					const { data: lead } = await this.assignment(e, promotor)
					return lead
				} catch (error) {
					throw new HttpException(
						`Hubieron algunos leads que ya están asignados`,
						HttpStatus.BAD_REQUEST,
					)
				}
			}),
		)

		return TransformResponse.map(
			leadsData,
			'Actualización de promotor correcta',
			'PUT',
		)
	}

	// Obtener leads asignados a un usuario
	async getByUser(id: string, params: FilterLeadDto) {
		const select = this.select()
		const filter = this.getParams(params)
		filter.where.userId = id

		const totalRows = await this.leads.count({ where: filter.where })

		const data = await this.leads.findMany({
			...filter,
			select,
			orderBy: {
				updateAt: 'desc', // 🔥 Ordena de más reciente a más antiguo
			},
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

	// Obtener valores de filtros dinámicamente desde la base de datos
	async getFilterValues(filter: string) {
		switch (filter) {
			case 'cycleId':
				const cycles = await this.cycles.findMany({
					select: { id: true, name: true },
				})
				return cycles.map((cycle) => ({ id: cycle.id, name: cycle.name }))

			case 'followUp':
				const followUps = await this.followUp.findMany({
					select: { id: true, name: true },
				})
				return followUps.map((followUp) => ({
					id: followUp.id,
					name: followUp.name,
				}))

			case 'asetnameId':
				const assetNames = await this.asetName.findMany({
					select: { id: true, name: true },
				})
				return assetNames.map((asset) => ({ id: asset.id, name: asset.name }))

			case 'countryId':
				const countries = await this.countries.findMany({
					select: { id: true, name: true },
				})
				return countries.map((country) => ({
					id: country.id,
					name: country.name,
				}))

			case 'cityId':
				const cities = await this.cities.findMany({
					select: { id: true, name: true },
				})
				return cities.map((city) => ({ id: city.id, name: city.name }))

			case 'stateId':
				const states = await this.states.findMany({
					select: { id: true, name: true },
				})
				return states.map((state) => ({ id: state.id, name: state.name }))

			case 'userId':
				const users = await this.user.findMany({
					select: {
						id: true,
						name: true,
						paternalSurname: true,
						maternalSurname: true,
					},
				})
				return users.map((user) => ({
					id: user.id,
					name: `${user.name} ${user.paternalSurname} ${user.maternalSurname || ''}`.trim(),
				}))

			case 'gradeId':
				const grades = await this.grades.findMany({
					select: { id: true, name: true },
				})
				return grades.map((grade) => ({ id: grade.id, name: grade.name }))

			case 'campaignId':
				const campaigns = await this.campaigns.findMany({
					select: { id: true, name: true },
				})
				return campaigns.map((campaign) => ({
					id: campaign.id,
					name: campaign.name,
				}))

			case 'careerId':
				const careers = await this.careers.findMany({
					select: { id: true, name: true },
				})
				return careers.map((career) => ({ id: career.id, name: career.name }))

			case 'medioContacto':
				const medios = await this.campaigns.findMany({
					select: { id: true, name: true },
				})
				return medios.map((medio) => ({ id: medio.id, name: medio.name }))

			case 'promotor':
				const promotores = await this.user.findMany({
					where: { roles: { some: { roleId: 2 } } },
					select: {
						id: true,
						name: true,
						paternalSurname: true,
						maternalSurname: true,
					},
				})
				return promotores.map((promotor) => ({
					id: promotor.id,
					name: `${promotor.name} ${promotor.paternalSurname} ${promotor.maternalSurname || ''}`.trim(),
				}))

			default:
				throw new HttpException('Filtro no soportado', HttpStatus.BAD_REQUEST)
		}
	}

	// Obtener todos los leads con filtros dinámicos
	async getFilteredLeads(params: LeadsFilterDto) {
		const where: any = {
			available: true,
			...(params.asetnameId && { asetName: { id: params.asetnameId } }),
			...(params.careerId && {
				information: { careerInterest: params.careerId },
			}),
			...(params.countryId && {
				city: { state: { countryId: params.countryId } },
			}),
			...(params.cityId && { city: { id: params.cityId } }),
			...(params.stateId && { city: { state: { id: params.stateId } } }),
			...(params.cycleId && { Cycle: { id: params.cycleId } }),
			...(params.gradeId && { grade: { id: params.gradeId } }),
			...(params.campaignId && { campaign: { id: params.campaignId } }),
			...(params.promoterId && { promoter: { id: params.promoterId } }),
			...(params.followUp && {
				information: { followUp: { name: params.followUp } },
			}), // Filtrado por nombre del seguimiento
			...(params.medioContacto && { campaign: { name: params.medioContacto } }), // Filtrado por nombre del medio de contacto
		}

		// Conteo de registros filtrados
		const totalRows = await this.leads.count({ where })

		// Datos filtrados y ordenados por fecha de creación
		const data = await this.leads.findMany({
			where,
			select: this.select(),
			orderBy: { createAt: 'desc' },
		})

		return TransformResponse.map({
			data: LeadResource.collection(data),
			meta: {
				totalRecords: totalRows,
			},
		})
	}

	// Obtener leads filtrados para un usuario específico
	async getFilteredLeadsByUser(params: LeadsFilterDto, user: any) {
		const where: any = {
			available: true,
			user: { id: user.id }, // Filtro adicional para limitar los resultados al usuario autenticado
			...(params.asetnameId && { asetName: { id: params.asetnameId } }),
			...(params.careerId && {
				information: { careerInterest: params.careerId },
			}),
			...(params.countryId && {
				city: { state: { countryId: params.countryId } },
			}),
			...(params.cityId && { city: { id: params.cityId } }),
			...(params.stateId && { city: { state: { id: params.stateId } } }),
			...(params.cycleId && { Cycle: { id: params.cycleId } }),
			...(params.gradeId && { grade: { id: params.gradeId } }),
			...(params.campaignId && { campaign: { id: params.campaignId } }),
			...(params.promoterId && { promoter: { id: params.promoterId } }),
			...(params.followUp && {
				information: { followUp: { name: params.followUp } },
			}),
			...(params.medioContacto && { campaign: { name: params.medioContacto } }),
		}

		console.log('Dynamic filter conditions for user: ', where) // Depuración

		// Conteo de registros filtrados
		const totalRows = await this.leads.count({ where })

		// Datos filtrados y ordenados por fecha de creación
		const data = await this.leads.findMany({
			where,
			select: this.select(),
			orderBy: { createAt: 'desc' },
		})

		return TransformResponse.map({
			data: LeadResource.collection(data),
			meta: {
				totalRecords: totalRows,
			},
		})
	}

	async findLeadByPhoneOrName(query: string) {
		const select = this.select() // ✅ Usamos la misma estructura que findAll

		const leads = await this.leads.findMany({
			where: {
				available: true,
				OR: [
					{ information: { name: { contains: query } } }, // ❌ Quitamos mode: "insensitive"
					{ phones: { some: { telephone: { contains: query } } } },
				],
			},
			select, // ✅ Usamos el mismo select que en findAll
			orderBy: { createAt: 'desc' },
		})

		return TransformResponse.map({
			data: LeadResource.collection(leads), // ✅ Usamos el mismo formato que en findAll
			http: {
				status: leads.length > 0 ? HttpStatus.OK : HttpStatus.NO_CONTENT,
				message: leads.length > 0 ? 'Resultados encontrados' : 'Sin resultados',
				method: 'GET',
				success: true,
			},
		})
	}

	async findLeadByPhoneOrNameForUser(query: string, user: any) {
		const select = this.select() // Usamos la misma estructura que en findAll

		const leads = await this.leads.findMany({
			where: {
				available: true,
				userId: user.id, // ✅ Solo devuelve leads asignados al usuario autenticado
				OR: [
					{ information: { name: { contains: query } } },
					{ phones: { some: { telephone: { contains: query } } } },
				],
			},
			select,
			orderBy: { createAt: 'desc' },
		})

		return TransformResponse.map({
			data: LeadResource.collection(leads), // ✅ Misma estructura de findAll
			http: {
				status: leads.length > 0 ? HttpStatus.OK : HttpStatus.NO_CONTENT,
				message: leads.length > 0 ? 'Resultados encontrados' : 'Sin resultados',
				method: 'GET',
				success: true,
			},
		})
	}
}
