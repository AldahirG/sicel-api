import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todos los PSeguimientos
router.get('/follow-ups', async (req, res) => {
    try {
        const follow_up = await prisma.followUp.findMany({
            skip: +req.query.skip,
            take: +req.query.take,
            orderBy: {
                id: 'desc'
            },
        });
        res.status(200).json(follow_up);
    } catch (error) {
        console.error('Error al encontrar los PSegumiento:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un PSegumiento
router.post('/follow-up', async (req, res) => {
    try {
        const { name } = req.body;

        const existingFollowUp = await prisma.followUp.findFirst({
            where: {
                name: name
            }
        });

        if (existingFollowUp) {
            return res.status(400).json({ mensaje: 'PSegumiento ya existente.' });
        }

        const newFollowUp = await prisma.followUp.create({
            data: {
                name: name,
            }
        });

        res.status(201).json(newFollowUp);

    } catch (error) {
        console.error('Error al crear un PSeguimiento: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un PSeguimiento
router.get('/follow-up/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el PSeguimiento su id     
        const follow_up = await prisma.followUp.findUnique({
            where: { id: parseInt(id) },
        });

        if (!follow_up) {
            return res.status(404).json({ message: 'PSegumiento no encontrado' });
        }

        res.status(200).json(follow_up);
    } catch (error) {
        console.error('Error al obtener el PSeguimiento: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un PSegumiento
router.put('/follow-up/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { name } = req.body;

        // Verifica si existe un PSegumiento mediante su id    
        const existingFollowUp = await prisma.followUp.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingFollowUp) {
            return res.status(404).json({ error: 'PSegumiento no encontrado.' });
        }

        // Verifica si el nombre ya está registrado en la base de datos
        const existingAtrributes = await prisma.followUp.findFirst({
            where: {
                name: name,
            }
        });

        if (existingAtrributes) {
            return res.status(400).json({ error: 'Ya existe un PSegumiento con este nombre.' });
        }

        const updatedFollowUp = await prisma.followUp.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
            },
        });

        res.status(200).json(updatedFollowUp);

    } catch (error) {
        console.error('Error al actualizar un PSeguimiento: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar una PSegumiento
router.delete('/follow-up/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el PSegumiento mediante su id    
        const existingFollowUp = await prisma.followUp.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (existingFollowUp) {
            await prisma.followUp.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.status(200).json({ message: 'PSegumiento eliminado exitosamente.' });
        } else {
            return res.status(404).json({ error: 'PSegumiento no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar un PSegumiento: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Contador de registros
router.get('/follow-ups/total', async (req, res) => {
    try {
        const total = await prisma.followUp.count();

        res.status(200).json(total);
    } catch (error) {
        console.error('Error obtener el total de PSeguimientos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener el listado de PSeguimientos
router.get('/follow-ups/list', async (req, res) => {
    try {
        const followUps = await prisma.followUp.findMany();
        res.status(200).json(followUps);
    } catch (error) {
        console.error('Error al encontrar los PSeguimientos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;