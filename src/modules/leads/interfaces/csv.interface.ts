import { Prisma } from '@prisma/client'

export interface CsvInterface {
	information: Object
	phones: Object
	emails: Object
	asetName: string
	createAt: Date
	grade: string
	promotor: string
}
