import { Prisma } from '@prisma/client'

export interface CsvInterface extends Prisma.LeadsCreateInput {
	telephone?: string
	email?: string
}
