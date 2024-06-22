import { CsvInterface } from 'src/modules/leads/interfaces/csv.interface'
import { ICsvDto } from 'src/modules/leads/dto/Csv.dto'
import { EnrollmentStatus, PrismaClient, ReferenceTypes, SchoolTypes } from '@prisma/client';
import { GenreCsv } from 'src/modules/leads/enums/GenreCsv.enum';

const prisma = new PrismaClient();

export class CsvLeadsResource {
	static async map(lead: ICsvDto): Promise<CsvInterface> {
		const grade = await prisma.grades.findFirst({
			where: { name: { contains: lead.GRADO } }
		})

		const followUp = await prisma.followUp.findFirst({
			where: { name: { contains: lead.SEGUIMIENTO } }
		})

		const asetName = await prisma.asetName.findFirst({
			where: { name: { contains: lead.AsetName } }
		})

		const campaign = await prisma.campaigns.findFirst({
			where: { name: { contains: lead.CAMPAIGN_NAME } }
		})

		const information = {
			create: {
				name: lead.NOMBRE,
				careerInterest: lead.CARRERA_INTERES,
				genre: GenreCsv[lead.GENERO],
				followUp: followUp ? { connect: { id: followUp.id } } : undefined,
				formerSchool: lead.ESCUELA_DE_PROCEDENCIA,
				typeSchool: SchoolTypes[lead.TIPO_DE_ESCUELA],
				enrollmentStatus: EnrollmentStatus[lead.STATUS]
			}
		}

		const reference = {
			create: {
				name: lead.NOMBRE_QUIEN_REFIERE,
				type: ReferenceTypes[lead.ES_REFERIDO],
				dataSource: lead.DONDE_OBT_DATO
			}
		}

		console.log(lead.FECHA_PRIMER_CONTACTO);

		return {
			information,
			dateContact: lead.FECHA_PRIMER_CONTACTO ? new Date(lead.FECHA_PRIMER_CONTACTO) : undefined,
			phones: {
				createMany: {
					data: lead.TELEFONOS.split(',').map((i) => ({ telephone: i })),
				}
			},
			emails: {
				createMany: {
					data: lead.CORREOS.split(',').map((i) => ({ email: i })),
				}
			},
			grade: grade ? {
				connect: { id: grade.id }
			} : undefined,
			semester: lead.SEMESTRE,
			asetName: asetName ? {
				connect: { id: asetName.id }
			} : undefined,
			campaign: campaign ? {
				connect: { id: campaign.id }
			} : undefined,
			reference,
			createAt: lead.CREATED_AT ? new Date(lead.CREATED_AT) : undefined
			//TODO Revisar implementación de promotor
		}
	}
}
