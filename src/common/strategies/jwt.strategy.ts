import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { envs } from 'src/config/envs'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: envs.jwtSecret,
		})
	}

	async validate(payload: any) {
		return {
			id: payload.id,
			name: payload.name,
			roles: payload.roles, // 👈 esto es lo importante
		}
	}
}
