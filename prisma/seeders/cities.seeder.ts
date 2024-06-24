import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function CitiesSeeder() {
	const [
		state1,
	] = await Promise.all([
		prisma.states.findFirst({ where: { name: 'MORELOS' } }),
	])
	const data = [
		{ name: 'AMACUZAC', stateId: state1.id },
		{ name: 'ATLATLAHUCAN', stateId: state1.id },
		{ name: 'AXOCHIAPAN', stateId: state1.id },
		{ name: 'AYALA', stateId: state1.id },
		{ name: 'COATLAN DEL RIO', stateId: state1.id },
		{ name: 'CUAUTLA', stateId: state1.id },
		{ name: 'CUERNAVACA', stateId: state1.id },
		{ name: 'EMILIANO ZAPATA', stateId: state1.id },
		{ name: 'HUITZILAC', stateId: state1.id },
		{ name: 'JANTETELCO', stateId: state1.id },
		{ name: 'JIUTEPEC', stateId: state1.id },
		{ name: 'JOJUTLA', stateId: state1.id },
		{ name: 'JONACATEPEC DE LEANDRO VALLE', stateId: state1.id },
		{ name: 'MAZATEPEC', stateId: state1.id },
		{ name: 'MIACATLAN', stateId: state1.id },
		{ name: 'OCUITUCO', stateId: state1.id },
		{ name: 'PUENTE DE IXTLA', stateId: state1.id },
		{ name: 'TEMIXCO', stateId: state1.id },
		{ name: 'TEMOAC', stateId: state1.id },
		{ name: 'TEPALCINGO', stateId: state1.id },
		{ name: 'TEPOZTLAN', stateId: state1.id },
		{ name: 'TETECALA', stateId: state1.id },
		{ name: 'TETELA DEL VOLCAN', stateId: state1.id },
		{ name: 'TLALNEPANTLA', stateId: state1.id },
		{ name: 'TLALTIZAPAN DE ZAPATA', stateId: state1.id },
		{ name: 'TLAQUILTENANGO', stateId: state1.id },
		{ name: 'TLAYACAPAN', stateId: state1.id },
		{ name: 'TOTOLAPAN', stateId: state1.id },
		{ name: 'XOCHITEPEC', stateId: state1.id },
		{ name: 'YAUTEPEC', stateId: state1.id },
		{ name: 'YECAPIXTLA', stateId: state1.id },
		{ name: 'ZACATEPEC', stateId: state1.id },
		{ name: 'ZACUALPAN DE AMILPAS', stateId: state1.id },
	]

	await prisma.cities.createMany({ data })
}
