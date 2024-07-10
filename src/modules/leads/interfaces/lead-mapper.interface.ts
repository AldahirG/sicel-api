import { asetName, Campaigns, Cycles, FollowUp, Grades, References, User } from "@prisma/client"

export interface LeadMapper {
    id: string
    grade: Grades
    dateContact: Date
    scholarship: string
    semester: string
    cycle: Pick<Cycles, 'id' | 'name' | 'cycle'>
    reference: Pick<References, 'type' | 'name' | 'dataSource'>
    information: Information
    campaign: Pick<Campaigns, 'id' | 'name'>
    asetName: Pick<asetName, 'id' | 'name'>
    phones: string[]
    emails: string[]
    address: {
        city: string
        state: string
        country: string
    }
    promoter: Pick<User, 'id' | 'name' | 'paternalSurname' | 'maternalSurname'>
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