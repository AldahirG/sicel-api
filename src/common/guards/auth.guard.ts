import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthUserResource } from 'src/modules/auth/mappers/auth-user.mapper'

const prisma = new PrismaClient()

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const accessToken = request.headers.authorization?.split(' ')[1]

		if (!accessToken) {
			throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED)
		}

		const user = await prisma.user.findFirst({
			where: { accessToken },
			include: {
				roles: {
					include: {
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		})

		if (!user || !user.available) {
			throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED)
		}

		const { token, ...rest } = AuthUserResource.map(user)

		request.user = rest

		return true
	}
}
