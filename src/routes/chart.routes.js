import express from 'express';
import { prisma } from '../db.js';
import { Prisma } from '@prisma/client';

const router = express.Router();

//filtrado 

router.get('/leads-filtrados', async (req, res) => {
    try {
        // Obtener los parámetros de consulta
        const filters = req.query;

        // Construir el objeto de filtro dinámicamente
        const whereClause = {};
        for (const field in filters) {
            // Ignorar los campos que no son campos de Lead
            if (Object.prototype.hasOwnProperty.call(filters, field) && field in Prisma.LeadScalarFieldEnum) {
                whereClause[field] = filters[field];
            }
        }

        // Consultar los leads utilizando la consulta construida dinámicamente
        const leadsFiltrados = await prisma.lead.findMany({
            where: whereClause
        });

        // Devolver los leads filtrados
        res.status(200).json(leadsFiltrados);
    } catch (error) {
        console.error('Error al obtener los leads filtrados:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Consultar total por status
router.get('/total-status', async (req, res) => {
    try {
        // Consulta para contar los leads agrupados por estado de inscripción
        const totalPorStatus = await prisma.lead.groupBy({
            by: ['enrollmentStatus'],
            _count: {
                id: true
            }
        });

        res.status(200).json(totalPorStatus);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por status:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint para contar leads por ciclo escolar
router.get('/recuento-leads-por-schoolYear', async (req, res) => {
    try {
        const leadsPorCiclo = await prisma.lead.groupBy({
            by: ['schoolYearId'], // Agrupar por el id del ciclo escolar
            _count: {
                id: true // Contar el número de leads por cada ciclo escolar
            }
        });

        // Mapear los resultados para incluir el nombre del ciclo escolar
        const leadsPorCicloConNombre = await Promise.all(leadsPorCiclo.map(async (lead) => {
            if (lead.schoolYearId) {
                const schoolYear = await prisma.schoolYear.findUnique({
                    where: {
                        id: lead.schoolYearId // Buscar el ciclo escolar por su id
                    }
                });
                return {
                    count: lead._count.id, // Renombrar la propiedad _count.id a count
                    schoolYear: schoolYear?.cicle || 'Ciclo desconocido' // Obtener el nombre del ciclo escolar o 'Ciclo desconocido' si no se encuentra
                };
            } else {
                return {
                    count: lead._count.id, // Renombrar la propiedad _count.id a count
                    schoolYear: 'Ciclo desconocido' // Asignar 'Ciclo desconocido' si schoolYearId es null
                };
            }
        }));

        res.status(200).json(leadsPorCicloConNombre);
    } catch (error) {
        console.error('Error al obtener los datos de recuento de leads por schoolYearId:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Consultar externos e internos
// router.get('/externos-internos', async (req, res) => {
//     try {
//         // Lógica para obtener los datos de la gráfica
//         const externosInternos = await prisma.lead.groupBy({
//             by: ['isOrganic'],
//             _count: {
//                 id: true
//             }
//         });

//         res.status(200).json(externosInternos);
//     } catch (error) {
//         console.error('Error al obtener los datos para la gráfica de externos e internos:', error);
//         res.status(500).send('Error interno del servidor');
//     }
// });

// Consultar % de beca
router.get('/porcentaje-beca', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const porcentajeBeca = await prisma.lead.groupBy({
            by: ['scholarship'],
            _count: {
                id: true
            }
        });

        res.status(200).json(porcentajeBeca);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de porcentaje de beca:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total por país
router.get('/total-pais', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const totalPorPais = await prisma.lead.groupBy({
            by: ['country'],
            _count: {
                id: true
            }
        });

        res.status(200).json(totalPorPais);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por país:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total por estado
router.get('/total-estado', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const totalPorEstado = await prisma.lead.groupBy({
            by: ['state'],
            _count: {
                id: true
            }
        });

        res.status(200).json(totalPorEstado);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por estado:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total por municipio
router.get('/total-municipio', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const totalPorMunicipio = await prisma.lead.groupBy({
            by: ['city'],
            _count: {
                id: true
            }
        });

        res.status(200).json(totalPorMunicipio);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por municipio:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total de inscripciones por usuario (promotor)
router.get('/total-inscripciones-por-promotor', async (req, res) => {
    try {
        // Lógica para obtener los datos del total de inscripciones por promotor
        const totalInscripcionesPorPromotor = await prisma.user.findMany({
            include: {
                leads: {
                    select: {
                        id: true
                    }
                }
            }
        });

        // Mapear los resultados para obtener el total de inscripciones por promotor
        const totalPorPromotor = totalInscripcionesPorPromotor.map(promotor => ({
            id: promotor.id,
            name: promotor.name,
            totalInscripciones: promotor.leads.length
        }));

        res.status(200).json(totalPorPromotor);
    } catch (error) {
        console.error('Error al obtener los datos del total de inscripciones por promotor:', error);
        res.status(500).send('Error interno del servidor');
    }
});




router.get('/reference-type', async (req, res) => {
    try {
        const leadsByReferenceType = await prisma.lead.groupBy({
            by: ['referenceType'],
            _count: {
                id: true
            }
        });

        res.status(200).json(leadsByReferenceType);
    } catch (error) {
        console.error('Error al obtener los datos para el endpoint de reference_type:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/admission-semester', async (req, res) => {
    try {
        const leadsByAdmissionSemester = await prisma.lead.groupBy({
            by: ['admissionSemester'],
            _count: {
                id: true
            }
        });

        res.status(200).json(leadsByAdmissionSemester);
    } catch (error) {
        console.error('Error al obtener los datos para el endpoint de admission_semester:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total de inscripciones por edad
router.get('/age', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const leads = await prisma.lead.findMany({
            where: {
                enrollmentDate: { not: null },
                dateBirth: { not: null }
            }
        });

        // Calcular la edad para cada lead
        const ageCounts = {};
        leads.forEach(lead => {
            const birthDate = new Date(lead.dateBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            ageCounts[age] = (ageCounts[age] || 0) + 1;
        });

        // Convertir los datos en el formato esperado para la gráfica
        const ageChartData = Object.keys(ageCounts).map(age => ({
            age: parseInt(age),
            _count: { id: ageCounts[age] }
        }));

        res.status(200).json(ageChartData);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total de inscripciones por edad:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Consultar total de inscripciones por programa
router.get('/programa', async (req, res) => {
    try {
        const totalPorPrograma = await prisma.lead.groupBy({
            by: ['gradeId'], // Agrupar por el campo "gradeId" de la tabla "Lead"
            _count: {
                id: true // Contar el número de inscripciones por programa
            },
            where: { gradeId: { not: null } } // Filtrar inscripciones donde "gradeId" no sea nulo
        });

        // Obtener los nombres de los programas utilizando join con la tabla "Grade"
        const programas = await Promise.all(totalPorPrograma.map(async (programa) => {
            const programaInfo = await prisma.grade.findUnique({
                where: { id: programa.gradeId },
                select: { name: true } // Seleccionar solo el nombre del programa
            });
            return { ...programa, programa: programaInfo?.name }; // Usar operador de encadenamiento opcional "?." para evitar errores si "programaInfo" es nulo
        }));

        res.status(200).json(programas);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total de inscripciones por programa:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Definir el endpoint para obtener las inscripciones por año
router.get('/inscripciones-por-anio', async (req, res) => {
    try {
        // Consultar todas las fechas de inscripción
        const leads = await prisma.lead.findMany({
            select: {
                enrollmentDate: true
            }
        });

        // Extraer los años de inscripción
        const years = leads.map(lead => {
            const year = new Date(lead.enrollmentDate).getFullYear();
            return year;
        });

        // Contar la cantidad de inscripciones por año
        const counts = {};
        years.forEach(year => {
            counts[year] = (counts[year] || 0) + 1;
        });

        // Preparar los datos para la respuesta
        const result = Object.keys(counts).map(year => ({
            year: parseInt(year),
            count: counts[year]
        }));

        // Devolver los resultados
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las inscripciones por año:', error);
        res.status(500).send('Error interno del servidor');
    }
});



// Definir el endpoint para obtener las inscripciones por mes
router.get('/inscripciones-por-mes', async (req, res) => {
    try {
        // Consultar todas las fechas de inscripción
        const leads = await prisma.lead.findMany({
            select: {
                enrollmentDate: true
            }
        });

        // Extraer los meses de inscripción
        const months = leads.map(lead => {
            const date = new Date(lead.enrollmentDate);
            return date.getMonth() + 1; // Sumamos 1 porque los meses son indexados desde 0
        });

        // Contar la cantidad de inscripciones por mes
        const counts = {};
        months.forEach(month => {
            counts[month] = (counts[month] || 0) + 1;
        });

        // Preparar los datos para la respuesta
        const result = Object.keys(counts).map(month => ({
            month: parseInt(month),
            count: counts[month]
        }));

        // Devolver los resultados
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las inscripciones por mes:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Consultar el recuento de leads por typeSchool
router.get('/recuento-leads-por-typeSchool', async (req, res) => {
    try {
        // Lógica para obtener el recuento de leads por typeSchool
        const recuentoLeadsPorTypeSchool = await prisma.lead.groupBy({
            by: ['typeSchool'],
            _count: {
                id: true
            }
        });

        res.status(200).json(recuentoLeadsPorTypeSchool);
    } catch (error) {
        console.error('Error al obtener el recuento de leads por typeSchool:', error);
        res.status(500).send('Error interno del servidor');
    }
});



router.get('/recuento-leads-por-contactMedium', async (req, res) => {
    try {
        const leadsPorMedioContacto = await prisma.lead.groupBy({
            by: ['contactMediumId'], // Agrupar por el id del medio de contacto
            _count: {
                id: true // Contar el número de leads por cada medio de contacto
            }
        });

        // Mapear los resultados para incluir el tipo de medio de contacto
        const leadsPorMedioContactoConTipo = await Promise.all(leadsPorMedioContacto.map(async (lead) => {
            if (lead.contactMediumId) {
                const contactMedium = await prisma.contactMedium.findUnique({
                    where: {
                        id: lead.contactMediumId // Buscar el medio de contacto por su id
                    }
                });
                return {
                    count: lead._count.id, // Renombrar la propiedad _count.id a count
                    contactMediumType: contactMedium?.type || null // Obtener el tipo de medio de contacto
                };
            } else {
                return {
                    count: lead._count.id, // Renombrar la propiedad _count.id a count
                    contactMediumType: null // Si contactMediumId es null, asignar null al tipo de medio de contacto
                };
            }
        }));

        res.status(200).json(leadsPorMedioContactoConTipo);
    } catch (error) {
        console.error('Error al obtener los datos de recuento de leads por contactMediumId:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Endpoint para obtener el recuento de leads por fuente de datos
router.get('/recuento-leads-por-dataSource', async (req, res) => {
    try {
        // Obtener el recuento de leads por cada categoría de fuente de datos
        const recuentoLeadsPorDataSource = await prisma.lead.groupBy({
            by: ['dataSource'],
            _count: {
                id: true
            }
        });

        res.status(200).json(recuentoLeadsPorDataSource);
    } catch (error) {
        console.error('Error al obtener el recuento de leads por fuente de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});




//charts promotor

// Consultar total por estado de inscripción filtrado por promotor
router.get('/total-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el total de inscripciones por estado de inscripción
        const totalPorStatus = await prisma.lead.groupBy({
            by: ['enrollmentStatus'],
            where: {
                userId: parsedUserId
            },
            _count: {
                id: true
            }
        });

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(totalPorStatus);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por status:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar porcentaje de beca filtrado por promotor
router.get('/porcentaje-beca/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el porcentaje de beca por usuario logeado
        const porcentajeBeca = await prisma.lead.groupBy({
            by: ['scholarship'],
            where: {
                userId: parsedUserId
            },
            _count: {
                id: true
            }
        });

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(porcentajeBeca);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de porcentaje de beca:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total por país filtrado por promotor
router.get('/total-pais/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el total por país por usuario logeado
        const totalPorPais = await prisma.lead.groupBy({
            by: ['country'],
            where: {
                userId: parsedUserId
            },
            _count: {
                id: true
            }
        });

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(totalPorPais);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por país:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total por estado filtrado por promotor
router.get('/total-estado/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el total por estado por usuario logeado
        const totalPorEstado = await prisma.lead.groupBy({
            by: ['state'],
            where: {
                userId: parsedUserId
            },
            _count: {
                id: true
            }
        });

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(totalPorEstado);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por estado:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Consultar total por municipio filtrado por promotor
router.get('/total-municipio/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el total por municipio por usuario logeado
        const totalPorMunicipio = await prisma.lead.groupBy({
            by: ['city'],
            where: {
                userId: parsedUserId
            },
            _count: {
                id: true
            }
        });

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(totalPorMunicipio);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total por municipio:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar total de inscripciones por promotor
router.get('/total-inscripciones-promotor/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el userId es un número válido
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'El userId proporcionado no es válido.' });
        }

        // Convertir el userId a tipo entero
        const parsedUserId = parseInt(userId);

        // Consultar el total de inscripciones por promotor
        const totalPorPromotor = await prisma.user.findUnique({
            where: {
                id: parsedUserId
            },
            select: {
                id: true,
                name: true,
                leads: {
                    where: {
                        enrollmentDate: {
                            not: null
                        }
                    }
                }
            }
        });

        // Verificar si el usuario existe
        if (!totalPorPromotor) {
            return res.status(404).json({ error: 'El usuario no fue encontrado.' });
        }

        // Calcular el total de inscripciones del promotor
        const totalInscripciones = totalPorPromotor.leads.length;

        // Preparar el resultado para enviar como respuesta
        const result = {
            id: totalPorPromotor.id,
            name: totalPorPromotor.name,
            totalInscripciones: totalInscripciones
        };

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total de inscripciones por promotor:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/leads-por-promotor/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId); // Obtener el userId de los parámetros de la URL
  
    try {
        // Consultar todos los leads que corresponden al userId dado y donde enrollmentDate no sea null
        const leadsPorPromotor = await prisma.lead.findMany({
            where: {
                userId: userId,
                enrollmentDate: {
                    not: null
                }
            }
        });
  
        res.status(200).json(leadsPorPromotor);
    } catch (error) {
        console.error('Error al obtener los leads por promotor:', error);
        res.status(500).send('Error interno del servidor');
    }
  });

// Otras rutas para las demás gráficas...






// Otras rutas para las demás gráficas...

export default router;

