import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todas las campañas
router.get('/campaigns', async (req, res) => {
    try {
        const campaign = await prisma.campaign.findMany({
            skip: +req.query.skip,
            take: +req.query.take,
            orderBy: {
                id: 'desc'
            },
        });
        res.status(200).json(campaign);
    } catch (error) {
        console.error('Error al encontrar las campañas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear una campaña
router.post('/campaign', async (req, res) => {
    try {
        const { name, type_campaign } = req.body;

        const existingCampaign = await prisma.campaign.findFirst({
            where: {
                name: name,
                type_campaign: type_campaign
            }
        });

        if (existingCampaign) {
            return res.status(400).json({ mensaje: 'Campaña ya existente.' });
        }

        const newCampaign = await prisma.campaign.create({
            data: {
                name: name,
                type_campaign: type_campaign
            }
        });

        res.status(201).json(newCampaign);

    } catch (error) {
        console.error('Error al crear una campaña:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar una campaña
router.get('/campaign/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el rol mediante su id     
        const campaign = await prisma.campaign.findUnique({
            where: { id: parseInt(id) },
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaña no encontrada' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error('Error al obtener una campaña:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar una campaña
router.put('/campaign/:id', async(req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { name, type_campaign, status } = req.body;

        // Validar que al menos un campo sea proporcionado
        if (!name || !type_campaign) {
            return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar.' });
        }

        // Verifica si existe una campaña mediante su id    
        const existingCampaign = await prisma.campaign.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingCampaign) {
            return res.status(404).json({ error: 'Campaña no encontrado.' });
        }

        // Verifica si el nombre o tipo de campaña ya está registrado en la base de datos
        const existingAtrributes = await prisma.campaign.findFirst({
            where: {
                name: name,
                type_campaign: type_campaign,
            }
        });

        if (existingAtrributes) {
            return res.status(400).json({ error: 'Ya existe una campaña con este nombre y/o tipo.' });
        }

        const updatedCampaign = await prisma.campaign.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name, 
                type_campaign,
                status: status !== undefined ? status : 1
            },
        });

        res.status(200).json(updatedCampaign);

    } catch (error) {
        console.error('Error al actualizar una campaña: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Contador de registros
router.get('/campaigns/total', async (req, res) => {
    try {
        const total = await prisma.campaign.count();

        res.status(200).json(total);
    } catch (error) {
        console.error('Error obtener el total de campañas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener el listado de campañas
router.get('/campaigns/list', async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany();
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error al encontrar las campañas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;