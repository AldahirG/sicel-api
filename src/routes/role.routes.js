import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Todos los roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.json(roles);
    } catch (error) {
        console.error('Error al encontrar los roles:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un rol
router.post('/role', async (req, res) => {
    try {
        const { name } = req.body;

        // Verifica si existe el rol mediante su id    
        const existingRole = await prisma.role.findUnique({
            where: {
                name: name
            }
        })

        // Si el rol existe, retornar un error
        if (existingRole) {
            return res.status(400).json({ mensaje: 'Rol ya existente.' });
        }

        const newRole = await prisma.role.create({
            data: {
                name: name
            }
        });

        // Retorna el nuevo promotor creado
        res.status(201).json(newRole);

    } catch (error) {
        console.error('Error al registrar rol:', error);
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

// Actualizar un rol
router.put('/role/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { name } = req.body;

        // Validar que al menos un campo sea proporcionado
        if (!name) {
            return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar.' });
        }

        // Verifica si existe el rol mediante su id    
        const existingRole = await prisma.role.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingRole) {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }

        const updatedRole = await prisma.role.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            },
        });

        res.status(200).json(updatedRole);

    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar un rol
router.delete('/role/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verifica si existe el rol mediante su id    
        const existingRole = await prisma.role.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (existingRole) {
            await prisma.role.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.status(200).json({ message: 'Rol eliminado exitosamente.' });
        } else {
            return res.status(404).json({ error: 'Rol no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).send('Error interno del servidor');
    }
})

export default router;