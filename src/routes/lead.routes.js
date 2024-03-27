import express from 'express';
import { prisma } from '../db.js';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';

const leads = [];
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No se ha proporcionado ningún archivo.' });
        }

        const leads = [];

        fs.createReadStream(file.path)
            .pipe(csvParser())
            .on('data', (row) => {
                leads.push(row);
            })
            .on('end', async () => {
                console.log('Archivo CSV procesado:', leads);

                for (const lead of leads) {
                    try {
                        await prisma.lead.create({
                            data: {
                                // Mapea los campos del lead según tu esquema de base de datos
                                // lead.name, lead.email, etc.
                                // Por ejemplo:
                                name: lead.name || null,
                                email: lead.email || null,
                                tel: lead.tel || null,
                                telOptional: lead.telOptional || null,
                                email : lead.email || null,
                                emailOptional: lead.emailOptional || null,
                                genre: lead.genre || null,
                                dateFirstContact: lead.dateFirstContact || null,
                                dateBirth: lead.dateBirth || null,
                                formerSchool: lead.formerSchool || null,
                                country: lead.country || null,
                                state: lead.state || null,
                                city: lead.city || null,
                                asetNameForm: lead.asetNameForm || null,
                                isOrganic: lead.isOrganic || null,
                                referenceType: lead.referenceType || null,
                                referenceName: lead.referenceName || null,
                                enrollmentDate: lead.enrollmentDate || null,
                                scholarship: lead.scholarship || null,
                                enrollmentStatus: lead.enrollmentStatus || null,
                                admissionSemester: lead.admissionSemester || null,
                                campaignId: lead.campaignId || 1,
                                followId: lead.followId || 1,
                                gradeId: lead.gradeId || 1,
                                carreerId: lead.carreerId || 1,
                                promoterId: lead.promoterId || 1,
                                
                                // Ajusta los demás campos según tu esquema
                            }
                        });
                    } catch (error) {
                        console.error('Error al insertar el lead en la base de datos:', error);
                    }
                }

                console.log('Lead creado:', newLead);
                // Lógica para insertar los leads en la base de datos aquí
                res.status(200).send('Archivo recibido y procesado exitosamente');
            });
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