import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function AsetName() {
	const [
		type1,
		type2,
		type3,
		type4,
		type5,
		type6,
		type7,
		type8,
		type9,
		type10,
		type11,
		type12,
		type13,
		type14,
		type15,
		type16,
		type17,
		type18,
		type19,
		type20,
	] = await Promise.all([
		prisma.contactTypes.findFirst({ where: { name: 'PAUTA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'LANDING' } }),
		prisma.contactTypes.findFirst({ where: { name: 'WHATSAPP DIRECTO' } }),
		prisma.contactTypes.findFirst({ where: { name: 'MARKETING DIGITAL' } }),
		prisma.contactTypes.findFirst({ where: { name: 'CLIENGO' } }),
		prisma.contactTypes.findFirst({ where: { name: 'APOYO TRABAJADOR' } }),
		prisma.contactTypes.findFirst({ where: { name: 'BASES' } }),
		prisma.contactTypes.findFirst({ where: { name: 'VISITA UNINTER' } }),
		prisma.contactTypes.findFirst({ where: { name: 'LLAMADA ENTRANTE' } }),
		prisma.contactTypes.findFirst({ where: { name: 'VISITA ESCUELA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'VISITA EMPRESA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'EVENTO INTERNO' } }),
		prisma.contactTypes.findFirst({ where: { name: 'EVENTO EXTERNO' } }),
		prisma.contactTypes.findFirst({ where: { name: 'PUBLICIDAD EMPRESA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'ALIANZA FRANCESA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'REFERIDO' } }),
		prisma.contactTypes.findFirst({ where: { name: 'MAILING' } }),
		prisma.contactTypes.findFirst({ where: { name: 'SICAP' } }),
		prisma.contactTypes.findFirst({ where: { name: 'UNINTER INFORMA' } }),
		prisma.contactTypes.findFirst({ where: { name: 'SEGUIMIENTO INSCRITOS' } }),
	])
	const data = [
		// PAUTA
		{ name: 'TIK TOK', contactTypesId: type1.id },
		{ name: 'IG', contactTypesId: type1.id },
		{ name: 'FB', contactTypesId: type1.id },
		{ name: 'GOOGLE', contactTypesId: type1.id },

		// LANDING
		{ name: 'PAGINAS UNIVERSIDAD', contactTypesId: type2.id },
		{ name: 'LEADSALES', contactTypesId: type2.id },
		{ name: 'CALCULADORA DE BECA', contactTypesId: type2.id },
		{ name: 'FORMULARIO RAPIDO', contactTypesId: type2.id },
		{ name: 'CONFERENCIAS', contactTypesId: type2.id },
		{ name: 'SESIONES INFORMATIVAS', contactTypesId: type2.id },
		{ name: 'TALLERES', contactTypesId: type2.id },
		{ name: 'ON DEMAND', contactTypesId: type2.id },
		{ name: 'TEST DE ORIENTACION VOCACIONAL', contactTypesId: type2.id },
		{ name: 'SOLICITUD DE ADMISION', contactTypesId: type2.id },
		{ name: 'UNINTER INFORMA', contactTypesId: type2.id },
		{ name: 'WHATSAPP', contactTypesId: type2.id },

		// WHATSAPP DIRECTO
		{ name: 'WHATSAPP DIRECTO', contactTypesId: type3.id },

		// MARKETING DIGITAL
		{ name: 'TIK TOK', contactTypesId: type4.id },
		{ name: 'IG', contactTypesId: type4.id },
		{ name: 'FB', contactTypesId: type4.id },

		// CLIENGO
		{ name: 'CLIENGO', contactTypesId: type5.id },

		// APOYO TRABAJADOR
		{ name: 'APOYO TRABAJADOR', contactTypesId: type6.id },

		// BASES
		{ name: 'BASE BAJAS', contactTypesId: type7.id },
		{ name: 'BASE DE EGRESADOS', contactTypesId: type7.id },
		{ name: 'BASE PERSONAL PROMOTOR', contactTypesId: type7.id },
		{ name: 'BASE EN FRIO', contactTypesId: type7.id },

		// VISITA UNINTER
		{ name: 'VISITA UNINTER', contactTypesId: type8.id },

		// LLAMADA ENTRANTE
		{ name: 'LLAMADA ENTRANTE', contactTypesId: type9.id },

		// VISITA ESCUELA
		{ name: 'FERIA ESCUELA', contactTypesId: type10.id },
		{ name: 'SESION ESCUELA', contactTypesId: type10.id },
		{ name: 'VISITA ESCUELA', contactTypesId: type10.id },
		
		// VISITA EMPRESA
		{ name: 'VISITA EMPRESA', contactTypesId: type11.id },

		// EVENTO INTERNO
		{ name: 'EVENTO INTERNO', contactTypesId: type12.id },

		// EVENTO EXTERNO
		{ name: 'EVENTO EXTERNO', contactTypesId: type13.id },

		// PUBLICIDAD EMPRESA
		{ name: 'FOLLETERIA', contactTypesId: type14.id },
		{ name: 'ESPECTACULARES', contactTypesId: type14.id },
		{ name: 'RUTAS', contactTypesId: type14.id },
		{ name: 'VALLAS', contactTypesId: type14.id },

		// ALIANZA FRANCESA
		{ name: 'PAUTA', contactTypesId: type15.id },
		{ name: 'MARKETING DIGITAL', contactTypesId: type15.id },
		{ name: 'LANDING', contactTypesId: type15.id },
		{ name: 'EVENTO', contactTypesId: type15.id },

		// REFERIDO
		{ name: 'PERSONAL UNINTER', contactTypesId: type16.id },
		{ name: 'ALUMNO', contactTypesId: type16.id },
		{ name: 'FAMILIAR ALUMNO', contactTypesId: type16.id },

		// MAILING
		{ name: 'MAILING', contactTypesId: type17.id },

		// SICAP
		{ name: 'SICAP', contactTypesId: type18.id },

		// UNINTER INFORMA
		{ name: 'UNINTER INFORMA', contactTypesId: type19.id },

		// SEGUIMIENTO INSCRITOS
		{ name: 'SEGUIMIENTO INSCRITOS', contactTypesId: type20.id },
	]

	await prisma.asetName.createMany({ data })
}
