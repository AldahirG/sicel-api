import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';

const router = Router();

// Consultar a todos los usuarios
router.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Crear un nuevo usuario
router.post('/user', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el email ya está en uso
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
});

// Consultar un usuario por su id
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});

// Actualizar un usuario por su id
router.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { email, password },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
});

// Eliminar a un usuario por su id
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});


export default router;