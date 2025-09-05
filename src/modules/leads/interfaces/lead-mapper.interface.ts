import {
	asetName,
	Campaigns,
	Cycles,
	FollowUp,
	Grades,
	References,
	User,
} from '@prisma/client'

export interface LeadMapper {
	id: string
	grade: Grades
	dateContact: Date
	scholarship: string
	semester?: string
	program?: string
	intern?: string
	cycle: Pick<Cycles, 'id' | 'name' | 'cycle'>
	reference: Pick<References, 'type' | 'name' | 'dataSource'>
	information: Information
	campaign: Pick<Campaigns, 'id' | 'name'>
	asetName: {
		id: string
		name: string
		contactType?: string | null
	}
	phones: string[]
	emails: string[]
	address: {
		city: string
		state: string
		country: string
	}
	promoter: Pick<User, 'id' | 'name' | 'paternalSurname' | 'maternalSurname'>
	updateAt: Date
	createAt: Date
}

interface Information {
	name: string
	genre: string
	careerInterest: string
	formerSchool: string
	typeSchool: string
	enrollmentStatus: string
	followUp: FollowUp
}
