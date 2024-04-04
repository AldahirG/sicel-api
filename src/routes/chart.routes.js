import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar total por status
router.get('/total-status', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
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

// // Consultar total por ciclo
// router.get('/total-ciclo', async (req, res) => {
//     try {
//         // Lógica para obtener los datos de la gráfica
//         const totalPorCiclo = await prisma.lead.groupBy({
//             by: {
//                 cicle: 'cicle'
//             },
//             _count: {
//                 id: true
//             }
//         });

//         res.status(200).json(totalPorCiclo);
//     } catch (error) {
//         console.error('Error al obtener los datos para la gráfica de total por ciclo:', error);
//         res.status(500).send('Error interno del servidor');
//     }
// });

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

// Consultar total de inscripciones por promotor
router.get('/total-inscripciones-promotor', async (req, res) => {
    try {
        // Lógica para obtener los datos de la gráfica
        const totalPorPromotor = await prisma.lead.groupBy({
            by: ['promoterId'],
            _count: {
                id: true
            }
        });

        res.status(200).json(totalPorPromotor);
    } catch (error) {
        console.error('Error al obtener los datos para la gráfica de total de inscripciones por promotor:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Otras rutas para las demás gráficas...

export default router;
