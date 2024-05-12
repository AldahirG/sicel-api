export class LeadResource {
    static map(lead: any) {
        return {
            id: lead.id,
            grade: lead.grade,
            dateContact: lead.dateContact,
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
                followUpId: lead.information?.followUpId
            },
            campaign: {
                id: lead.campaign?.id,
                name: lead.campaign?.name
            },
            asetName: {
                id: lead.asetName?.id,
                name: lead.asetName?.name
            },
            phones: lead.phones?.map((i) => i.telephone),
            emails: lead.emails?.map((i) => i.email),
            address: {
                city: lead.city?.name,
                state: lead.city?.state.name,
                country: lead.city?.state.country.name
            }
        }
    }
}