import express from 'express';
import { prisma } from '../db.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import path from 'path';

const router = express.Router();
const storage = multer.memoryStorage(); // Almacenar en memoria en lugar de en el disco
const upload = multer({ storage: storage }); // Usar el storage personalizado

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No se ha proporcionado ningún archivo.' });
        }

        // Validar la extensión del archivo
        const allowedExtensions = ['.csv'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ success: false, message: 'Tipo de archivo no permitido. Solo se permiten archivos .csv.' });
        }

        const fileData = file.buffer.toString();
        const rows = fileData.trim().split('\n');

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        for (let i = 1; i < rows.length; i++) { // Comenzamos desde el índice 1 para omitir la primera fila
            const row = rows[i].split(',');
            const lead = {
                name: row[0] || 'Sin Nombre',
                tel: row[1] || null,
                email: row[2] || null,
                telOptional: row[3] ? row[3] : null,
                emailOptional: row[4] ? row[4] : null,
                dateFirstContact: row[5] || formattedDate,
                asetNameForm: row[6] || null,
                campaignId: parseInt(row[7]) || null,
                // Mapea los demás campos según sea necesario
            };

            try {
                await prisma.lead.create({
                    data: lead
                });
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

// Manejo de errores de Multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Error de carga del archivo:', err);
        res.status(500).json({ success: false, message: 'Error en la carga del archivo.' });
    } else {
        next(err);
    }
});

// Manejo de errores generales
router.use((err, req, res, next) => {
    console.error('Error inesperado:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
});

// Consultar todos los PSeguimientos
router.get('/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            include: {
                campaign: {
                    include: true
                },
                followUp: {
                    include: true
                },
                grade: {
                    include: true
                },
                carreer: {
                    include: true
                },
                promoter: {
                    include: true
                },
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

export default router;