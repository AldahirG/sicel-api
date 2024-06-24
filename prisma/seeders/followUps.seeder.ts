import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: "AU-ALUMNO UNINTER" },
	{ name: "INSC-INSCRIPCIÓN" },
	{ name: "NC-NO CONTESTA" },
	{ name: "NI-NO INTERESA" },
	{ name: "P-PROSPECTO" },
	{ name: "PI-PROSPECTO INSCRIPCIÓN" },
	{ name: "PS-PROSPECTO SEGUIMIENTO" },
	{ name: "SC-SIN CONTACTO" },
	{ name: "PU-PERSONAL UNINTER" },
	{ name: "DU-DUPLICADO" },
	{ name: "DI-DATO NO VALIDO" },
	{ name: "BA-BAJA ALUMNO" },
	{ name: "VACIO" },
]

export async function FollowUpsSeeder() {
	const followUps = await prisma.followUp.createMany({
		data,
		skipDuplicates: true,
	})
}