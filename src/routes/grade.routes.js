import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Todos los grados escolares
router.get('/grades', async (req, res) => {
    try {
        const grades = await prisma.grade.findMany();
        res.status(200).json(grades);
    } catch (error) {
        console.error('Error al encontrar los grados escolares: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un grado escolar
router.post('/grade', async (req, res) => {
    try {
        const { name } = req.body;

        const existingGrade = await prisma.grade.findFirst({
            where: {
                name: name
            }
        });

        if (existingGrade) {
            return res.status(400).json({ mensaje: 'Grado escolar ya existente.' });
        }

        const newGrade = await prisma.grade.create({
            data: {
                name: name,
            }
        });

        res.status(201).json(newGrade);

    } catch (error) {
        console.error('Error al crear un grado escolar: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un grado escolar
router.get('/grade/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el grado escolar mediante su id     
        const grade = await prisma.grade.findUnique({
            where: { id: parseInt(id) },
        });

        if (!grade) {
            return res.status(404).json({ message: 'Grado escolar no encontrado' });
        }

        res.status(200).json(grade);
    } catch (error) {
        console.error('Error al obtener el grado escolar: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un grado escolar
router.put('/grade/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Campos que se actualizaran
        const { name } = req.body;

        // Verifica si existe un grado escolar mediante su id    
        const existingGrade = await prisma.grade.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingGrade) {
            return res.status(404).json({ error: 'Grado escolar no encontrado.' });
        }

        // Verifica si el nombre ya está registrado en la base de datos
        const existingAtrributes = await prisma.grade.findFirst({
            where: {
                name: name,
            }
        });

        if (existingAtrributes) {
            return res.status(400).json({ error: 'Ya existe un grado escolar con este nombre.' });
        }

        const updatedGrade = await prisma.grade.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
            },
        });

        res.status(200).json(updatedGrade);

    } catch (error) {
        console.error('Error al actualizar un grado escolar: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar una grado escolar
router.delete('/grade/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si existe el grado escolar mediante su id    
        const existingGrade = await prisma.grade.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (existingGrade) {
            await prisma.grade.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.status(200).json({ message: 'Grado escolar eliminado exitosamente.' });
        } else {
            return res.status(404).json({ error: 'Grado escolar no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar un grado escolar: ', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;