import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaClient } from '@prisma/client';
import { TransformResponse } from 'src/common/mappers/transform-response';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { IPaymentWhere } from './interfaces/payment-where.interface';

@Injectable()
export class PaymentsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
		this.$connect()
	}

  async create(createPaymentDto: CreatePaymentDto) {
    const data = await this.payments.create({
			data: createPaymentDto,
		})
		return TransformResponse.map(
			data,
			'Pago creado con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
  }

  async findAll(params: PaginationFilterDto) {
    const filter = this.getParams(params)

		const totalRows = await this.payments.count({ where: filter.where })

		const data = await this.payments.findMany({
			...filter,
		})

		return TransformResponse.map({
			data: data,
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
		})
  }

  async findOne(id: string) {
    const data = await this.payments.findFirst({
			where: { id, available: true },
		})
		if (!data) {
			throw new HttpException(
				`Pago con id ${id} no encontrado`,
				HttpStatus.NOT_FOUND,
			)
		}
		return TransformResponse.map(data)
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id)
		const data = await this.payments.update({
			where: { id },
			data: updatePaymentDto,
		})
		return TransformResponse.map(data, 'Pago actualizado con éxito!!', 'PUT')
  }

  async remove(id: string) {
    await this.findOne(id)
		const data = await this.payments.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			data,
			'Pago eliminado con éxito!!',
			'DELETE',
		)
  }

  private getParams(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const condition: IPaymentWhere = {
			where: { available: true },
			orderBy: [{ id: 'desc' }],
		}

		if (paginated) {
			condition.skip = (page - 1) * perPage
			condition.take = perPage
		}
		return condition
	}

	async findByEnrollmentIdWithDetails(enrollmentId: string) {
  const data = await this.payments.findFirst({
    where: {
      enrollmentId,
      available: true,
    },
    include: {
      Enrollment: {
        include: {
          Career: true,
          Lead: {
            include: {
              information: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    throw new HttpException(
      `No se encontró un pago para la inscripción ${enrollmentId}`,
      HttpStatus.NOT_FOUND,
    );
  }

  return TransformResponse.map(data);
}

	
	
}
