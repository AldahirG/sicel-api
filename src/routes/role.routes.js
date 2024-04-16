import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Todos los roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al encontrar los roles:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Encontrar rol por id
router.get('/role/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el rol mediante su id     
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
        });

        if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json(role);
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;