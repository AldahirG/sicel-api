import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todas las carreras con paginación
router.get('/carreers', async (req, res) => {
    try {
        const carreers = await prisma.carreer.findMany({
            skip: +req.query.skip,
            take: +req.query.take,
            orderBy: {
                id: 'desc'
            }
        });

        res.status(200).json(carreers);
    } catch (error) {
        console.error('Error al encontrar las carreras:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear una carrera
router.post('/carreer', async (req, res) => {
    try {
        const { name, slug } = req.body;

        const existingCarreer = await prisma.carreer.findFirst({
            where: {
                OR: [
                    { name: name },
                    { slug: slug}
                ]
            }
        });

        if (existingCarreer) {
            return res.status(400).json({ mensaje: 'Carrera o abreviatura ya existente.' });
        }

        const newCarreer = await prisma.carreer.create({
            data: {
                name: name,
                slug: slug
            }
        });

        res.status(201).json(newCarreer);

    } catch (error) {
        console.error('Error al crear una campaña: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar una carrera
router.get('/carreer/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el rol mediante su id     
        const carreer = await prisma.carreer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!carreer) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }

        res.status(200).json(carreer);
    } catch (error) {
        console.error('Error al obtener una campaña: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar una carrera
router.put('/carreer/:id', async(req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { name, slug } = req.body;

        // Verifica si existe una carrera mediante su id    
        const existingCarreer = await prisma.carreer.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingCarreer) {
            return res.status(404).json({ error: 'Carrera no encontrada.' });
        }

        // Verifica si el nombre o tipo de carrera ya está registrado en la base de datos
        const existingAtrributes = await prisma.carreer.findFirst({
            where: {
              name: name,
              slug: slug,
            }
          });
          
        if (existingAtrributes) {
            return res.status(400).json({ error: 'Ya existe una carrera con este nombre y/o abreviatura.' });
        }

        const updatedCarreer = await prisma.carreer.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name, 
                slug,
            },
        });

        res.status(200).json(updatedCarreer);

    } catch (error) {
        console.error('Error al actualizar una carrera: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Contador de registros
router.get('/carreers/total', async (req, res) => {
    try {
        const total = await prisma.carreer.count();

        res.status(200).json(total);
    } catch (error) {
        console.error('Error obtener el total de carreras:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener el listado de carreras
router.get('/carreers/list', async (req, res) => {
    try {
        const carreers = await prisma.carreer.findMany();
        res.status(200).json(carreers);
    } catch (error) {
        console.error('Error al encontrar las carreras:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;