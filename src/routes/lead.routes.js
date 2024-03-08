import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todos los PSeguimientos
router.get('/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany();
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


export default router;