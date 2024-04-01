import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todos los PSeguimientos
router.get('/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            include: {
                campaign: true,
                followUp: true,
                grade: true,
                carreer: true,
                user: true,
            }
        });
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error al encontrar los leads:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un lead
router.post('/lead', async (req, res) => {
    try {
        const leadData = req.body;

        // Verificar si ya existe un lead con el mismo email, email opcional, nombre, teléfono o teléfono opcional
        const existingLead = await prisma.lead.findFirst({
            where: {
                OR: [
                    { name: leadData.name },
                    { tel: leadData.tel },
                    { telOptional: leadData.telOptional },
                    { email: leadData.email },
                    { emailOptional: leadData.emailOptional }
                ]
            }
        });

        if (existingLead) {
            return res.status(400).json({ mensaje: 'Ya existe un lead con estos datos de contacto.' });
        }

        // Crear un nuevo lead si no existe un lead con los datos proporcionados
        const newLead = await prisma.lead.create({
            data: {
                ...leadData
            }
        });

        res.status(201).json(newLead);

    } catch (error) {
        console.error('Error al crear un Lead: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un lead por su ID
router.get('/lead/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const lead = await prisma.lead.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                campaign: true,
                followUp: true,
                grade: true,
                carreer: true,
                user: true,
            }
        });

        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ error: 'lead no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener lead: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un lead
router.put('/lead/:id', async (req, res) => {
    const { id } = req.params;
    const leadData = req.body;

    try {
        // Verificar si el lead existe
        const existingLead = await prisma.lead.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingLead) {
            return res.status(404).json({ mensaje: 'Lead no encontrado.' });
        }

        // Actualizar el lead con los datos proporcionados
        const updatedLead = await prisma.lead.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...leadData
            }
        });

        res.status(200).json(updatedLead);

    } catch (error) {
        console.error('Error al actualizar un Lead: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;