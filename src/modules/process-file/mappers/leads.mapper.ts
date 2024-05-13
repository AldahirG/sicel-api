import { Prisma } from "@prisma/client";

export class CsvLeadsResource {
    static map(lead: any): Prisma.LeadsCreateInput {
        return {
            campaign: { connect: { id: lead?.campaignId } } ?? undefined,
            grade: lead.grade,
            emails: {
                createMany: { data: [{ email: lead?.email }, { email: lead?.emailOptional }] }
            },
            phones: {
                createMany: { data: [{ telephone: lead?.tel }, { telephone: lead?.telOptional }] }
            },
            information: {
                create: {
                    name: lead?.name
                }
            },
            createAt: lead?.created_at !== '' ? new Date(lead?.created_at) : undefined
        }
    }
}