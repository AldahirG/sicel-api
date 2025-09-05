import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function ContactTypes() {
	const data: Prisma.ContactTypesCreateInput[] = [
		{ name: 'PAUTA' },
		{ name: 'LANDING' },
		{ name: 'WHATSAPP DIRECTO' },
		{ name: 'MARKETING DIGITAL' },
		{ name: 'CLIENGO' },
		{ name: 'APOYO TRABAJADOR' },
		{ name: 'BASES' },
		{ name: 'VISITA UNINTER' },
		{ name: 'LLAMADA ENTRANTE' },
		{ name: 'VISITA ESCUELA' },
		{ name: 'VISITA EMPRESA' },
		{ name: 'EVENTO INTERNO' },
		{ name: 'EVENTO EXTERNO' },
		{ name: 'PUBLICIDAD IMPRESA' },
		{ name: 'ALIANZA FRANCESA' },
		{ name: 'REFERIDO' },
		{ name: 'MAILING' },
		{ name: 'SICAP' },
		{ name: 'UNINTER INFORMA' },
		{ name: 'SEGUIMIENTO INSCRITOS' },
		{ name: 'CAMBACEO' },
		{ name: 'UNINTERKIDS' },
		{ name: 'EMAGISTER' },
	]

	await prisma.contactTypes.createMany({
		data,
		skipDuplicates: true,
	})
}
