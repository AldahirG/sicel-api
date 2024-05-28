import { CsvInterface } from "src/modules/leads/interfaces/csv.interface";
import { ICsvDto } from "src/modules/leads/dto/Csv.dto";

export class CsvLeadsResource {
    static map(lead: ICsvDto): CsvInterface {
        const information = lead.Nombre ? { create: { name: lead.Nombre } } : undefined
        const emails = lead.Correos ? { createMany: { data: lead.Correos.split(',').map((i) => ({ email: i })) } } : undefined
        const phones = lead.Telefonos ? { createMany: { data: lead.Telefonos.split(',').map((i) => ({ telephone: i })) } } : undefined
        return {
            information,
            phones,
            emails,
            asetName: lead?.AsetName,
            createAt: lead?.Created_at !== '' ? new Date(lead?.Created_at) : undefined,
            grade: lead?.Grade,
            promotor: lead?.Promotor
        }
    }
}