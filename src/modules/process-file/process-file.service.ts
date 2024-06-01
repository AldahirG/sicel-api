import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as csvParser from 'csv-parser'
import { CsvLeadsResource } from './mappers/leads.mapper'
import { CsvInterface } from '../leads/interfaces/csv.interface'

@Injectable()
export class ProcessFileService {
	async readCsv(file: Express.Multer.File): Promise<Array<CsvInterface>> {
		if (!file) {
			throw new HttpException(
				`No se a subido ningún archivo.`,
				HttpStatus.BAD_REQUEST,
			)
		}
		if (file.mimetype !== 'text/csv') {
			throw new HttpException(
				`El archivo no es CSV.`,
				HttpStatus.UNPROCESSABLE_ENTITY,
			)
		}

		return new Promise((resolve, reject) => {
			const results = []
			const parser = csvParser()
			parser.on('data', (data) => {
				results.push(CsvLeadsResource.map(data))
			})
			parser.on('end', () => resolve(results))
			parser.on('error', (error) => reject(error))
			parser.write(file.buffer)
			parser.end()
		})
	}
}
