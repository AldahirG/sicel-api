import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'
import { ISelect } from '../interfaces/select.interface'
import { IUserWhere } from '../interfaces/where.interface'
import { FilterUserDTO } from '../dto/filter-user.dto'

@Injectable()
export class HelperService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	select(): ISelect {
		const select: ISelect = {
			id: true,
			name: true,
			paternalSurname: true,
			maternalSurname: true,
			email: true,
			password: true,
			roles: {
				select: {
					role: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			additionalInfo: {
				select: {
					telephone: true,
				},
			},
		}
		return select
	}

	getParams(params: FilterUserDTO) {
		const { search, page, 'per-page': perPage, paginated, role } = params

		const OR = search ? [{ name: { contains: search } }] : undefined

		const condition: IUserWhere = {
			where: {
				available: true,
				OR,
			},
			orderBy: [{ id: 'desc' }],
		}

		if (role) {
			condition.where.roles = { some: { roleId: +role } }
		}

		if (paginated) {
			condition.skip = (page - 1) * perPage
			condition.take = perPage
		}

		return condition
	}
}
