import { CsvInterface } from 'src/modules/leads/interfaces/csv.interface'
import { ICsvDto } from 'src/modules/leads/dto/Csv.dto'
import {
	EnrollmentStatus,
	PrismaClient,
	ReferenceTypes,
	SchoolTypes,
} from '@prisma/client'
import { GenreCsv } from 'src/modules/leads/enums/GenreCsv.enum'

const prisma = new PrismaClient()

export class CsvLeadsResource {
	static async map(lead: ICsvDto): Promise<CsvInterface> {
		const grade = lead.GRADO
			? await prisma.grades.findFirst({
					where: { name: { contains: lead.GRADO } },
				})
			: undefined

		const followUp = lead.SEGUIMIENTO
			? await prisma.followUp.findFirst({
					where: { name: { contains: lead.SEGUIMIENTO } },
				})
			: undefined

		const asetName = lead.AsetName
			? await prisma.asetName.findFirst({
					where: { name: { contains: lead.AsetName } },
				})
			: undefined

		const campaign = lead.CAMPAIGN_NAME
			? await prisma.campaigns.findFirst({
					where: { name: { contains: lead.CAMPAIGN_NAME } },
				})
			: undefined

		const city = lead.CIUDAD
			? await prisma.cities.findFirst({
					where: { name: { contains: lead.CIUDAD } },
				})
			: undefined

		const cycle = lead.CICLO
			? await prisma.cycles.findFirst({
					where: { cycle: { contains: lead.CICLO } },
				})
			: undefined

		const promoter = lead.PROMOTOR
			? await prisma.user.findFirst({
					where: { id: { contains: lead.PROMOTOR } },
				})
			: undefined

		const information = {
			create: {
				name: lead.NOMBRE,
				careerInterest: lead.CARRERA_INTERES,
				genre: GenreCsv[lead.GENERO],
				followUp: followUp
					? {
							connect: { id: followUp.id },
						}
					: undefined,
				formerSchool: lead.ESCUELA_DE_PROCEDENCIA,
				typeSchool: SchoolTypes[lead.TIPO_DE_ESCUELA],
				enrollmentStatus: EnrollmentStatus[lead.STATUS],
			},
		}

		const reference = {
			create: {
				name: lead.NOMBRE_QUIEN_REFIERE,
				type: ReferenceTypes[lead.ES_REFERIDO],
				dataSource: lead.DONDE_OBT_DATO,
			},
		}

		return {
			dateContact: lead.FECHA_PRIMER_CONTACTO
				? new Date(lead.FECHA_PRIMER_CONTACTO)
				: undefined,

			asetName: asetName
				? {
						connect: { id: asetName.id },
					}
				: undefined,

			reference,

			campaign: campaign
				? {
						connect: { id: campaign.id },
					}
				: undefined,

			city: city
				? {
						connect: { id: city.id },
					}
				: undefined,

			information,

			Cycle: cycle
				? {
						connect: { id: cycle.id },
					}
				: undefined,

			semester: lead.SEMESTRE,

			//TODO: Agregar beca ofrecida

			grade: grade
				? {
						connect: { id: grade.id },
					}
				: undefined,

			phones: {
				createMany: {
					data: lead.TELEFONOS.split(',').map((i) => ({ telephone: i })),
				},
			},
			emails: {
				createMany: {
					data: lead.CORREOS.split(',').map((i) => ({ email: i })),
				},
			},

			createAt: lead.CREATED_AT ? new Date(lead.CREATED_AT) : undefined,

			//TODO Revisar implementación de promotor
			user: promoter
				? {
						connect: { id: promoter.id },
					}
				: undefined,
		}
	}
}
