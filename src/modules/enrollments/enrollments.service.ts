import {
	Injectable,
	OnModuleInit,
	HttpStatus,
	HttpException,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto'
import { TransformResponse } from 'src/common/mappers/transform-response'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import * as ExcelJS from 'exceljs'
import { Response } from 'express'

@Injectable()
export class EnrollmentsService extends PrismaClient implements OnModuleInit {
	onModuleInit() {
		this.$connect()
	}

	async create(createEnrollmentDto: CreateEnrollmentDto) {
		const { leadId } = createEnrollmentDto

		const lead = await this.leads.findUnique({ where: { id: leadId } })
		if (!lead) {
			throw new HttpException('Lead no encontrado', HttpStatus.NOT_FOUND)
		}

		const existing = await this.enrollments.findFirst({ where: { leadId } })
		if (existing) {
			throw new HttpException(
				'Este lead ya tiene una inscripción registrada.',
				HttpStatus.CONFLICT,
			)
		}

		const enrollment = await this.enrollments.create({
			data: {
				...createEnrollmentDto,
			},
		})

		return TransformResponse.map(
			enrollment,
			'Inscripción registrada con éxito!!',
			'POST',
			HttpStatus.CREATED,
		)
	}

	async findAll(params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const baseFilter = {
			where: { available: true },
			orderBy: [{ createAt: 'desc' }],
			include: {
				Lead: {
					include: {
						user: true, // 👈 correcto
						information: true,
						phones: true,
						emails: true,
					},
				},
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		}

		const filter: any = { ...baseFilter }

		if (paginated) {
			filter.skip = (page - 1) * perPage
			filter.take = perPage
		}

		const total = await this.enrollments.count({ where: baseFilter.where })
		const data = await this.enrollments.findMany(filter)

		return TransformResponse.map({
			data,
			meta: paginated
				? {
						currentPage: page,
						nextPage: page * perPage >= total ? null : page + 1,
						totalPages: Math.ceil(total / perPage),
						perPage,
						totalRecords: total,
						prevPage: page === 1 ? null : page - 1,
					}
				: undefined,
		})
	}

	async findOne(id: string) {
		const data = await this.enrollments.findFirst({
			where: { id, available: true },
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		})

		if (!data) {
			throw new HttpException('Inscripción no encontrada', HttpStatus.NOT_FOUND)
		}

		return TransformResponse.map(data)
	}

	async update(id: string, dto: UpdateEnrollmentDto) {
		await this.findOne(id) // Asegura que exista antes de actualizar

		const data = await this.enrollments.update({
			where: { id },
			data: {
				careersId: dto.careersId,
				promotionId: dto.promotionId,
				channelId: dto.channelId,
				listId: dto.listId,
				leadId: dto.leadId,
				enrollment_folio: dto.enrollment_folio,
				matricula: dto.matricula,
				scholarship: dto.scholarship,
				curp: dto.curp, // <- corregido: minúsculas
				comments: dto.comments, // <- corregido: minúsculas
				createAt: dto.createAt,

			},
		})

		return TransformResponse.map(
			data,
			'Inscripción actualizada con éxito!!',
			'PUT',
		)
	}

	async remove(id: string) {
		await this.findOne(id)
		const data = await this.enrollments.update({
			where: { id },
			data: { available: false },
		})
		return TransformResponse.map(
			data,
			'Inscripción eliminada con éxito!!',
			'DELETE',
		)
	}

	// 🚀 Servicios para usuarios autenticados (por userId)
	async findAllByUser(userId: string, params: PaginationFilterDto) {
		const { page, 'per-page': perPage, paginated } = params

		const baseFilter = {
			where: {
				available: true,
				Lead: {
					userId,
				},
			},
			orderBy: [{ createAt: 'desc' }],
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		}

		const filter: any = { ...baseFilter }

		if (paginated) {
			filter.skip = (page - 1) * perPage
			filter.take = perPage
		}

		const total = await this.enrollments.count({ where: baseFilter.where })
		const data = await this.enrollments.findMany(filter)

		return TransformResponse.map({
			data,
			meta: paginated
				? {
						currentPage: page,
						nextPage: page * perPage >= total ? null : page + 1,
						totalPages: Math.ceil(total / perPage),
						perPage,
						totalRecords: total,
						prevPage: page === 1 ? null : page - 1,
					}
				: undefined,
		})
	}

	async findOneByUser(userId: string, enrollmentId: string) {
		const data = await this.enrollments.findFirst({
			where: {
				id: enrollmentId,
				available: true,
				Lead: {
					userId,
				},
			},
			include: {
				Lead: true,
				Channel: true,
				Promotion: true,
				Career: true,
				List: true,
			},
		})

		if (!data) {
			throw new HttpException(
				'Inscripción no encontrada para este usuario.',
				HttpStatus.NOT_FOUND,
			)
		}

		return TransformResponse.map(data)
	}

	async exportToExcel(res: Response) {
		const enrollments = await this.enrollments.findMany({
			where: { available: true },
			include: {
				Career: true,
				Promotion: true,
				Channel: true,
				List: true,
				Payments: true,
				Lead: {
					include: {
						user: true,
						information: {
							include: {
								followUp: true,
							},
						},
						emails: true,
						phones: true,
						city: {
							include: {
								state: {
									include: {
										country: true,
									},
								},
							},
						},
						campaign: true,
						asetName: {
							include: {
								contactType: true,
							},
						},
						reference: true,
						grade: true,
						Cycle: true,
					},
				},
			},
		})

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Inscripciones')

		worksheet.columns = [
			{ header: 'Nombre', key: 'name', width: 25 },
			{ header: 'Correo', key: 'email', width: 30 },
			{ header: 'Teléfono', key: 'phone', width: 20 },
			{ header: 'Folio', key: 'folio', width: 20 },
			{ header: 'Matrícula', key: 'matricula', width: 15 },
			{ header: 'CURP', key: 'curp', width: 20 },
			{ header: 'Carrera', key: 'career', width: 30 },
			{ header: 'Promoción', key: 'promotion', width: 30 },
			{ header: 'Canal', key: 'channel', width: 20 },
			{ header: 'Lista', key: 'list', width: 15 },
			{ header: 'Beca', key: 'scholarship', width: 10 },
			{ header: 'Seguimiento', key: 'followUp', width: 25 },
			{ header: 'País', key: 'country', width: 20 },
			{ header: 'Estado', key: 'state', width: 20 },
			{ header: 'Ciudad', key: 'city', width: 20 },
			{ header: 'Ciclo', key: 'cycle', width: 15 },
			{ header: 'Asset Name', key: 'assetName', width: 30 },
			{ header: 'Campaña', key: 'campaign', width: 30 },
			{ header: 'Medio de contacto', key: 'contactType', width: 25 },
			{ header: 'Tipo referido', key: 'referenceType', width: 25 },
			{ header: 'Nombre referido', key: 'referenceName', width: 30 },
			{ header: 'Pago concepto', key: 'paymentConcept', width: 30 },
			{ header: 'Pago monto', key: 'paymentAmount', width: 15 },
		]

		for (const e of enrollments) {
			const lead = e.Lead
			worksheet.addRow({
				name: lead?.information?.name || '',
				email: lead?.emails?.[0]?.email || '',
				phone: lead?.phones?.[0]?.telephone || '',
				folio: e.enrollment_folio || '',
				matricula: e.matricula || '',
				curp: e.curp || '',
				career: e.Career?.name || '',
				promotion: e.Promotion?.name || '',
				channel: e.Channel?.name || '',
				list: e.List?.noLista || '',
				scholarship: e.scholarship || '',
				followUp: lead?.information?.followUp?.name || '',
				country: lead?.city?.state?.country?.name || '',
				state: lead?.city?.state?.name || '',
				city: lead?.city?.name || '',
				cycle: lead?.Cycle?.cycle || '',
				assetName: lead?.asetName?.name || '',
				campaign: lead?.campaign?.name || '',
				contactType: lead?.asetName?.contactType?.name || '',
				referenceType: lead?.reference?.type || '',
				referenceName: lead?.reference?.name || '',
				paymentConcept: e.Payments?.documentNumber || '',
				paymentAmount: e.Payments?.amount || '',
			})
		}

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=inscripciones.xlsx',
		)

		await workbook.xlsx.write(res)
		res.end()
	}

	async exportToExcelByList(res: Response, listId: string) {
  // ── Helpers ─────────────────────────────────────────────────────────────
  const fmtDate = (d?: Date | string | null) => {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const dobFromCurp = (curp?: string | null): string => {
    if (!curp || curp.length < 10) return '';
    const yy = parseInt(curp.slice(4, 6), 10);
    const mm = parseInt(curp.slice(6, 8), 10);
    const dd = parseInt(curp.slice(8, 10), 10);
    if (!yy || !mm || !dd) return '';
    const nowYY = new Date().getFullYear() % 100;
    const fullYear = yy <= nowYY ? 2000 + yy : 1900 + yy;
    return fmtDate(new Date(fullYear, mm - 1, dd));
  };

  const COMMISSION_MAP: Record<string, number> = {
    '0': 824, '5': 704, '10': 548, '15': 464, '20': 344,
    '25': 280, '30': 224, '35': 204, '40': 184, '45': 164,
    '50': 104, '55': 84, '60': 64,
  };
  const SPECIAL_LABELS = new Set(['APOYO TRABAJADOR', 'ORFANDAD', 'PATRONATO']);
  const computeCommission = (scholarship?: string | null): string | number => {
    if (!scholarship) return '';
    const key = String(scholarship).trim().toUpperCase();
    if (key in COMMISSION_MAP) return COMMISSION_MAP[key];
    if (SPECIAL_LABELS.has(key)) return key; // etiqueta textual
    return '';
  };

  // ── Datos ───────────────────────────────────────────────────────────────
  const list = await this.lists.findUnique({ where: { id: listId } });
  const noLista = list?.noLista || 'SIN NOMBRE';

  const enrollments = await this.enrollments.findMany({
    where: { available: true, listId },
    orderBy: [{ createAt: 'desc' }],
    include: {
      Career: true,
      Promotion: true,
      Channel: true,
      List: true,
      Payments: true, // para PAGADO/NO PAGADO
      Lead: {
        include: {
          user: true,
          information: { include: { followUp: true } },
          emails: true,
          phones: true,
          city: { include: { state: { include: { country: true } } } },
          campaign: true,
          asetName: { include: { contactType: true } },
          reference: true,
          grade: true,
          Cycle: true,
          Comments: true,
        },
      },
    },
  });

  // Mapeo a filas en el orden requerido (32 columnas)
  const rows = enrollments.map((e) => {
    const lead = e.Lead;
    const info = lead?.information;
    const user = lead?.user;
    const observations =
      (e.comments ?? '').trim() || (lead?.Comments?.[0]?.description ?? '');

    const promoter = user
      ? [user.name, user.paternalSurname, user.maternalSurname].filter(Boolean).join(' ')
      : '';

    // OJO: la comisión sale numérica si la beca está en el mapa; si no, queda texto (especial)
    const commission = computeCommission(e.scholarship);

    return [
      promoter,                       // 1 NOMBRE DE PROMOTOR
      fmtDate(e.createAt),            // 2 FECHA DE INSCRIPCIÓN (Enrollments.createAt)
      fmtDate(lead?.createAt),        // 3 createAt(LEADS)
      info?.name ?? '',               // 4 NOMBRE LEADS
      info?.enrollmentStatus ?? '',   // 5 STATUS
      lead?.Cycle?.cycle ?? '',       // 6 CICLO ESCOLAR
      lead?.grade?.name ?? '',        // 7 GRADO
      e.Career?.program ?? '',        // 8 PROGRAMA
      lead?.semester ?? '',           // 9 SEMESTRE DE INGRESO
      e.matricula ?? '',              // 10 MATRICULA
      e.enrollment_folio ?? '',       // 11 NO. DE RECIBO
      e.scholarship ?? '',            // 12 % DE BECA
      commission,                     // 13 TOTAL DE COMISION
      info?.formerSchool ?? '',       // 14 ESCUELA DE PROCEDENCIA
      info?.typeSchool ?? '',         // 15 PUBLICA/PRIVADA
      lead?.city?.state?.country?.name ?? '', // 16 PAIS
      lead?.city?.state?.name ?? '',          // 17 ESTADO
      lead?.city?.name ?? '',                 // 18 MUNICIPIO
      lead?.asetName?.contactType?.name ?? '',// 19 MEDIO DE CONTACTO
      lead?.asetName?.name ?? '',             // 20 ASET NAME
      lead?.campaign?.name ?? '',             // 21 CAMPAÑA
      e.Channel?.name ?? '',                  // 22 CANAL DE VENTA
      lead?.reference?.type ?? '',            // 23 tipo REFIRIO
      lead?.reference?.name ?? '',            // 24 NOMBRE
      lead?.reference?.dataSource ?? '',      // 25 DONDE OBTUVO EL DATO
      e.Promotion?.name ?? '',                // 26 PROMOCION DE INSCRIPCION
      lead?.phones?.[0]?.telephone ?? '',     // 27 TELEFONICO LEAD
      lead?.emails?.[0]?.email ?? '',         // 28 CORREO ELECTRONICO DEL LEAD
      dobFromCurp(e.curp),                    // 29 FECHA DE NACIMIENTO
      observations,                           // 30 OBSERVACIONES
      e.matricula ? `${e.matricula}@alumnouninter.mx` : '', // 31 CORREO INSTITUCIONAL
      e.Payments ? 'PAGADO' : 'SIN PAGO',     // 32 PAGADO/NO PAGADO
    ];
  });

  // ── Excel con estilos ────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`LISTA ${noLista}`);

  // Título
  sheet.mergeCells('A1:AF1'); // 32 columnas -> AF
  const title = sheet.getCell('A1');
  title.value = `LISTA ${noLista} - INSCRIPCIONES`;
  title.font = { bold: true, size: 14 };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 24;
  // Relleno suave
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAF1FB' } };

  // Creamos la tabla con estilo y los encabezados
  const headers = [
    'NOMBRE DE PROMOTOR','FECHA DE INSCRIPCIÓN','createAt (LEADS)','NOMBRE LEADS','STATUS',
    'CICLO ESCOLAR','GRADO','PROGRAMA','SEMESTRE DE INGRESO','MATRICULA',
    'NO. DE RECIBO','% DE BECA','TOTAL DE COMISION','ESCUELA DE PROCEDENCIA',
    'ESCUELA PUBLICA O PRIVADA','PAIS','ESTADO','MUNICIPIO','MEDIO DE CONTACTO',
    'ASET NAME','CAMPAÑA','CANAL DE VENTA','tipo REFIRIO','NOMBRE','DONDE OBTUVO EL DATO',
    'PROMOCION DE INSCRIPCION','TELEFONICO LEAD','CORREO ELECTRONICO DEL LEAD',
    'FECHA DE NACIMIENTO DEL PROSPECTO','OBSERVACIONES','CORREO INSTITUCIONAL','PAGADO/NO PAGADO'
  ];

  sheet.addTable({
    name: `TablaInscripciones_${Date.now()}`,
    ref: 'A2',
    headerRow: true,
    totalsRow: false,
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: headers.map(h => ({ name: h })),
    rows, // nuestras filas mapeadas
  });

  // Ajustes de columnas: anchuras y alineación centrada
  const widths = [
    30,16,16,35,14,16,18,18,20,16,18,14,18,28,24,16,18,18,20,22,22,20,18,26,24,24,20,30,24,34,30,18
  ];
  widths.forEach((w, i) => {
    const col = sheet.getColumn(i + 1);
    col.width = w;
    col.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  // Formato moneda para "TOTAL DE COMISION" (columna 13)
  sheet.getColumn(13).numFmt = '$#,##0.00';

  // Congelar filas 1-2 (título y encabezados)
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 2 }];

  // Bordes finos a toda el área usada
  const lastRow = sheet.rowCount;
  for (let r = 2; r <= lastRow; r++) {
    const row = sheet.getRow(r);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  // Respuesta
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=lista-inscripciones.xlsx',
  );
  await workbook.xlsx.write(res);
  res.end();
}


}
