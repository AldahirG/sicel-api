import { LeadMapper } from '../interfaces/lead-mapper.interface'

export class LeadResource {
	static map(lead: any): LeadMapper {
		return {
			id: lead.id,
			grade: lead.grade,
			dateContact: lead.dateContact,
			scholarship: lead.scholarship,
			semester: lead.semester,
			program: lead.program,
			intern: lead.intern,
			cycle: {
				id: lead.Cycle?.id,
				name: lead.Cycle?.name,
				cycle: lead.Cycle?.cycle,
			},
			reference: {
				type: lead.reference?.type,
				name: lead.reference?.name,
				dataSource: lead.reference?.dataSource,
			},
			information: {
				name: lead.information?.name,
				genre: lead.information?.genre,
				careerInterest: lead.information?.careerInterest,
				formerSchool: lead.information?.formerSchool,
				typeSchool: lead.information?.typeSchool,
				enrollmentStatus: lead.information?.enrollmentStatus,
				followUp: lead.information?.followUp,
			},
			campaign: {
				id: lead.campaign?.id,
				name: lead.campaign?.name,
			},
			asetName: {
				id: lead.asetName?.id,
				name: lead.asetName?.name,
				contactType: lead.asetName?.contactType?.name || null,
			},
			phones: lead.phones?.map((i) => i.telephone),
			emails: lead.emails?.map((i) => i.email),
			address: {
				city: lead.city?.name,
				state: lead.city?.state.name,
				country: lead.city?.state.country,
			},
			promoter: {
				id: lead.user?.id,
				name: lead.user?.name,
				paternalSurname: lead.user?.paternalSurname,
				maternalSurname: lead.user?.maternalSurname,
			},
			updateAt: lead.updateAt,
		}
	}

	static collection(leads: any[]): LeadMapper[] {
		const data = leads.map((lead) => this.map(lead))
		return data
	}
}
