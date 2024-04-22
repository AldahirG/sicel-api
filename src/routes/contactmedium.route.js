import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todos los medios de contacto
router.get('/contact-mediums', async (req, res) => {
    try {
        const contact_mediums = await prisma.contactMedium.findMany({
            skip: +req.query.skip,
            take: +req.query.take,
            orderBy: {
                id: 'desc'
            },
        });
        res.status(200).json(contact_mediums);
    } catch (error) {
        console.error('Error al encontrar los medios de contacto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un medio de contacto
router.post('/contact-medium', async (req, res) => {
    try {
        const { type } = req.body;

        const existingContactMedium = await prisma.contactMedium.findFirst({
            where: {
                type: type
            }
        });

        if (existingContactMedium) {
            return res.status(400).json({ mensaje: 'Medio de contacto ya existente.' });
        }

        const newContactMedium = await prisma.contactMedium.create({
            data: {
                type: type,
            }
        });

        res.status(201).json(newContactMedium);

    } catch (error) {
        console.error('Error al crear un medio de contacto: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un PSeguimiento
router.get('/contact-medium/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contact_medium = await prisma.contactMedium.findUnique({
            where: { id: parseInt(id) },
        });

        if (!contact_medium) {
            return res.status(404).json({ message: 'Medio de contacto no encontrado' });
        }

        res.status(200).json(contact_medium);
    } catch (error) {
        console.error('Error al obtener el medio de contacto: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un medio de contacto
router.put('/contact-medium/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { type } = req.body;
   
        const existingContactMedium = await prisma.contactMedium.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingContactMedium) {
            return res.status(404).json({ error: 'Medio de contacto no encontrado.' });
        }

        // Verifica si el nombre ya está registrado en la base de datos
        const existingAtrributes = await prisma.contactMedium.findFirst({
            where: {
                type: type,
            },
        });

        if (existingAtrributes) {
            return res.status(400).json({ error: 'Ya existe un medio de contacto con este nombre.' });
        }

        const updatedContactMedium = await prisma.contactMedium.update({
            where: {
                id: parseInt(id)
            },
            data: {
                type: type,
            },
        });

        res.status(200).json(updatedContactMedium);

    } catch (error) {
        console.error('Error al actualizar un medio de contacto: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Contador de registros
router.get('/contact-mediums/total', async (req, res) => {
    try {
        const total = await prisma.contactMedium.count();

        res.status(200).json(total);
    } catch (error) {
        console.error('Error obtener el total de medios de contacto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener el listado de medios de contacto
router.get('/contact-mediums/list', async (req, res) => {
    try {
        const contactMediums = await prisma.contactMedium.findMany();
        res.status(200).json(contactMediums);
    } catch (error) {
        console.error('Error al encontrar los medios de contacto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;