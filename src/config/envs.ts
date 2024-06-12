import 'dotenv/config'
import * as joi from 'joi'

interface IEnvsVars {
	JWT_SECRET: string
	DATABASE_URL: string
}

const envSchema = joi
	.object({
		DATABASE_URL: joi.string().required(),
		JWT_SECRET: joi.string().required(),
	})
	.unknown()

const { error, value } = envSchema.validate({
	...process.env,
})

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

const env: IEnvsVars = value

export const envs = {
	jwtSecret: env.JWT_SECRET,
}
