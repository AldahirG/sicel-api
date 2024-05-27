import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { HelperService } from './helpers/helper.service';
import { LeadResource } from './mapper/lead.mapper';
import { ProcessFileService } from '../process-file/process-file.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadsService extends HelperService {
  constructor(private readonly csvService: ProcessFileService) { super() }

  async create(createLeadDto: CreateLeadDto, user) {
    const select = this.select()
    const { information, campaignId, gradeId, asetNameId, cityId, userId, reference, email, phone, scholarship, semester, ...leadData } = createLeadDto;


    const campaignConnect = campaignId ? { connect: { id: campaignId } } : undefined;
    const gradeConnect = gradeId ? { connect: { id: gradeId } } : undefined;
    const assetNameConnect = asetNameId ? { connect: { id: asetNameId } } : undefined;
    const cityConnect = cityId ? { connect: { id: cityId } } : undefined;
    const emails = email ? { createMany: { data: email.map((i) => ({ email: i })) } } : undefined
    const phones = phone ? { createMany: { data: phone.map((i) => ({ telephone: i })) } } : undefined
    const assignLead = user.roles.some(assignment => assignment.roleId === 2) ? { connect: { id: user.id } } : undefined
    const scholar = `${scholarship}`
    const sem = `${semester}`

    const lead = await this.leads.create({
      data: {
        ...leadData,
        campaign: campaignConnect,
        asetName: assetNameConnect,
        grade: gradeConnect,
        user: assignLead,
        city: cityConnect,
        scholarship: scholar,
        semester: sem,
        reference: {
          create: reference
        },
        information: {
          create: information
        },
        emails,
        phones
      },
      select
    });
    return TransformResponse.map(LeadResource.map(lead), 'Lead creado con éxito!!', 'POST', HttpStatus.CREATED)
  }

  async findAll(params: PaginationFilterDto) {
    const select = this.select()
    const filter = this.getParams(params)
    const totalRows = await this.leads.count({ where: filter.where });

    const data = await this.leads.findMany({
      ...filter,
      select
    });

    return TransformResponse.map({
      data: LeadResource.collection(data),
      meta: params.paginated
        ? {
          currentPage: params.page,
          nextPage:
            Math.ceil(totalRows / params['per-page']) == params.page
              ? null
              : params.page + 1,
          totalPages: Math.ceil(totalRows / params['per-page']),
          perPage: params['per-page'],
          totalRecords: totalRows,
          prevPage: params.page == 1 ? null : params.page - 1,
        }
        : undefined,
    });
  }

  async findOne(id: string) {
    const select = this.select()
    const data = await this.leads.findFirst({
      where: { id, available: true },
      select
    });
    if (!data) {
      throw new HttpException(
        `Lead not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return TransformResponse.map(LeadResource.map(data));
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const { data: lead } = await this.findOne(id);
    const select = this.select();
    const { information, campaignId, asetNameId, cityId, userId, reference, email, phone, scholarship, semester, ...leadData } = updateLeadDto;

    const campaignConnect = campaignId ? { connect: { id: campaignId } } : undefined;
    const asetNameConnect = asetNameId ? { connect: { id: asetNameId } } : undefined;
    const userConnect = userId ? { connect: { id: userId } } : undefined;
    const cityConnect = cityId ? { connect: { id: cityId } } : undefined;
    const emails = email ? { createMany: { data: email.map((i) => ({ email: i })) } } : undefined
    const phones = phone ? { createMany: { data: phone.map((i) => ({ telephone: i })) } } : undefined
    const scholar = `${scholarship}`
    const sem = `${semester}`

    if (!lead.dateContact) {
      leadData.dateContact = new Date()
    }

    const updateLead = await this.leads.update({
      where: { id },
      data: {
        ...leadData,
        campaign: campaignConnect,
        asetName: asetNameConnect,
        user: userConnect,
        city: cityConnect,
        scholarship: scholar,
        semester: sem,
        reference: {
          upsert: {
            create: reference,
            update: reference
          }
        },
        information: {
          upsert: {
            create: information,
            update: information
          }
        },
        emails: {
          deleteMany: {},
          ...emails
        },
        phones: {
          deleteMany: {},
          ...phones
        }
      },
      select
    });
    return TransformResponse.map(LeadResource.map(updateLead), 'Lead actualizado con éxito!!', 'PUT', HttpStatus.OK)
  }

  async remove(id: string) {
    await this.findOne(id);
    const data = await this.leads.update({
      where: { id },
      data: { available: false }
    });
    return TransformResponse.map(data, 'Lead eliminado con éxito!!', 'DELETE')
  }

  async assignment(id: string, userId: string) {
    const select = this.select()
    const { data: lead } = await this.findOne(id)
    if (lead.promoter.id) {
      throw new HttpException(
        `El lead ya a sido asignado a un promotor`,
        HttpStatus.CONFLICT,
      );
    }
    const data = await this.leads.update({
      where: { id },
      data: {
        user: {
          connect: { id: userId }
        }
      },
      select
    })
    return TransformResponse.map(LeadResource.map(data), 'El lead a sido asignado correctamente!!', 'PUT')
  }

  async CreateFromFileShare(file: Express.Multer.File) {
    const select = this.select()
    const data: Prisma.LeadsCreateInput[] = await this.csvService.readCsv(file);
    const newLeads = await Promise.all(data.map(async (data) => {
      const lead = await this.leads.create({ data, select });
      return LeadResource.map(lead);
    }));

    return TransformResponse.map(newLeads, 'Lead creado con éxito!!', 'POST', HttpStatus.CREATED)
  }
}
