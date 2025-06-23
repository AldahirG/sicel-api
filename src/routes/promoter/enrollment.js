import express from 'express'
import { prisma } from '../../db.js'

const router = express.Router()

router.get('/promoter/:id/enrollments', async (req, res) => {
	try {
		const { id } = req.params

		const completeLeads = await prisma.lead.findMany({
			skip: +req.query.skip,
			take: +req.query.take,
			orderBy: {
				id: 'desc',
			},
			where: {
				userId: parseInt(id),
				NOT: {
					OR: [
						{ genre: null },
						{ enrollmentStatus: null },
						{ career: null },
						{ formerSchool: null },
						{ typeSchool: null },
						{ country: null },
						{ state: null },
						{ city: null },
						{ referenceType: null },
						{ referenceName: null },
						{ dataSource: null },
						{ admissionSemester: null },
						{ dateFirstContact: null },
						{ scholarship: null },
						{ schoolYearId: null },
						{ followId: 2 },
						{ gradeId: null },
						{ userId: null },
						{ contactMediumId: null },
					],
				},
				AND: {
					telOptional: null,
					emailOptional: null,
				},
			},
			select: {
				id: true,
				name: true,
				schoolYear: true,
				grade: true,
				user: true,
				tel: true,
				email: true,
			},
		})

		// Devuelve los leads encontrados
		res.json(completeLeads)
	} catch (error) {
		// Maneja cualquier error que pueda ocurrir
		console.error('Error retrieving complete leads:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

export default router
