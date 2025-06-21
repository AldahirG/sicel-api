import {
	HttpException,
	HttpStatus,
	Injectable,
	OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { LoginDTO } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'
import { IJwt } from './interfaces/jwt.interface'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { AuthUserResource } from './mappers/auth-user.mapper'

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect()
	}

	constructor(private readonly jwtService: JwtService) {
		super()
	}

	async signJWT(payload: any) {
  return this.jwtService.sign(payload);
}


async login(payload: LoginDTO) {
	console.log('Payload recibido:', payload);
	const { email, password } = payload;

	const user = await this.user.findFirst({
		where: { email },
		select: {
			id: true,
			name: true,
			paternalSurname: true,
			maternalSurname: true,
			email: true,
			accessToken: true,
			password: true,
			roles: { select: { role: { select: { name: true } } } },
		},
	});
	console.log('Roles completos:', JSON.stringify(user.roles, null, 2));

	console.log('Usuario encontrado:', user);

	if (!user) {
		throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
	}

	const isValid = bcrypt.compareSync(password, user.password);

	if (!isValid) {
		throw new HttpException(`Invalid credentials`, HttpStatus.BAD_REQUEST);
	}

	//! Genera token si no existe
	if (!user.accessToken) {
		const mappedRoles = user.roles.map(r => ({
			roleId: r.role.name === 'Promotor' ? 2 : r.role.name === 'Administrador' ? 1 : 0,
		}));

		user.accessToken = await this.signJWT({
			email: user.email,
			id: user.id,
			name: user.name,
			roles: mappedRoles,
		});

		await this.user.update({
			where: {
				id: user.id,
			},
			data: {
				accessToken: user.accessToken,
			},
		});
	}

	// ✅ Mapea los roles con su ID correspondiente
const mappedRoles = user.roles.map((r) => ({
  name: r.role.name,
  roleId: r.role.name === 'Promotor' ? 2 : r.role.name === 'Administrador' ? 1 : 0,
}));

const { password: ___, accessToken: token, ...rest } = user;

return TransformResponse.map(
  AuthUserResource.map({
    ...rest,
    roles: mappedRoles,
    token,
  }),
  'Inicio de sesión exitoso !!',
  'POST',
);


}


	async logout(token: string) {
		const user = await this.user.findFirst({
			where: { accessToken: token },
		})

		await this.user.update({
			where: {
				id: user.id,
			},
			data: {
				accessToken: null,
			},
		})

		return TransformResponse.map({}, 'Session successfully closed', 'POST')
	}
}
