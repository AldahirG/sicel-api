import express from 'express';
import { prisma } from '../db.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import path from 'path';
import { create } from 'domain';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No se ha proporcionado ningún archivo.' });
        }

        const allowedExtensions = ['.csv'];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ success: false, message: 'Tipo de archivo no permitido. Solo se permiten archivos .csv.' });
        }

        const fileData = file.buffer.toString();
        const rows = fileData.trim().split('\n');

        const currentDate = new Date().toISOString();

        for (let i = 1; i < rows.length; i++) { // Se comienza desde el índice 0
            const row = rows[i].split(',');
            const lead = {
                name: row[0] || 'Sin Nombre',
                tel: row[1] || null,
                telOptional: row[2] || null,
                email: row[3] || null,
                emailOptional: row[4] || null,
                asetNameForm: row[5] || null,
                campaignId: parseInt(row[6]) || null,
                userId: 1,
                created_at: i === 1 ? currentDate : (row[7] || currentDate), // Se asigna la fecha actual solo al primer dato
            };

            try {
                await prisma.lead.create({ data: lead });
            } catch (error) {
                console.error('Error al insertar el lead en la base de datos:', error);
            }
        }

        res.status(200).send('Archivo recibido y procesado exitosamente');
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        res.status(500).send('Error interno del servidor');
    }
});

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

        // Verificar si ya existe un lead con el mismo email
        const existingEmail = await prisma.lead.findFirst({
            where: {
                email: leadData.email
            }
        });

        if (existingEmail) {
            return res.status(400).json({ errorEmail: 'Ya existe un lead con este email.' });
        }

        // Verificar si ya existe un lead con el mismo número de teléfono
        const existingTel = await prisma.lead.findFirst({
            where: {
                tel: leadData.tel
            }
        });

        if (existingTel) {
            return res.status(400).json({ errorTel: 'Ya existe un lead con este número de teléfono.' });
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

        // Verificar si el correo o teléfono ya están siendo utilizados por otro lead
        const existingLeadWithEmail = await prisma.lead.findFirst({
            where: {
                OR: [
                    { email: leadData.email },
                    { tel: leadData.tel }
                ],
                NOT: {
                    id: parseInt(id)
                }
            }
        });

        if (existingLeadWithEmail) {
            return res.status(400).json({ errorMessage: 'El correo o teléfono ya están siendo utilizados.' });
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