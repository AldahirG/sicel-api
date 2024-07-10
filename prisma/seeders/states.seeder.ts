import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function StatesSeeder() {
	const [
		country1,
	] = await Promise.all([
		prisma.countries.findFirst({ where: { name: 'MEXICO' } }),
	])
	const data = [
		{ name: 'AGUASCALIENTES', countryId: country1.id },
        { name: 'BAJA CALIFORNIA', countryId: country1.id },
        { name: 'BAJA CALIFORNIA SUR', countryId: country1.id },
        { name: 'CAMPECHE', countryId: country1.id },
        { name: 'CHIAPAS', countryId: country1.id },
        { name: 'CHIHUAHUA', countryId: country1.id },
        { name: 'CIUDAD DE MEXICO', countryId: country1.id },
        { name: 'COAHUILA', countryId: country1.id },
        { name: 'COLIMA', countryId: country1.id },
        { name: 'DURANGO', countryId: country1.id },
        { name: 'GUANAJUATO', countryId: country1.id },
        { name: 'GUERRERO', countryId: country1.id },
        { name: 'HIDALGO', countryId: country1.id },
        { name: 'JALISCO', countryId: country1.id },
        { name: 'MEXICO', countryId: country1.id },
        { name: 'MICHOACAN', countryId: country1.id },
        { name: 'MORELOS', countryId: country1.id },
        { name: 'NAYARIT', countryId: country1.id },
        { name: 'NUEVO LEON', countryId: country1.id },
        { name: 'OAXACA', countryId: country1.id },
        { name: 'PUEBLA', countryId: country1.id },
        { name: 'QUERETARO', countryId: country1.id },
        { name: 'QUINTANA ROO', countryId: country1.id },
        { name: 'SAN LUIS POTOSI', countryId: country1.id },
        { name: 'SINALOA', countryId: country1.id },
        { name: 'SONORA', countryId: country1.id },
        { name: 'TABASCO', countryId: country1.id },
        { name: 'TAMAULIPAS', countryId: country1.id },
        { name: 'TLAXCALA', countryId: country1.id },
        { name: 'VERACRUZ', countryId: country1.id },
        { name: 'YUCATAN', countryId: country1.id },
        { name: 'ZACATECAS', countryId: country1.id },
	]

	await prisma.states.createMany({ data })
}
