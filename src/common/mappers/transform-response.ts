import { HttpStatus } from '@nestjs/common'

export class TransformResponse {
	static map(
		response: any,
		message = '',
		method = 'GET',
		status = HttpStatus.OK,
	) {
		const meta = 'meta' in response ? response.meta : null
		const data = 'data' in response ? response.data : response

		return {
			http: {
				status: status,
				message: message,
				method: method,
				success: true,
			},
			data: data,
			meta: meta,
		}
	}
}
