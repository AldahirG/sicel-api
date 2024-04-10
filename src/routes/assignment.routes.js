import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Asignar un promotor
router.post('/lead/assign', async (req, res) => {
  try {
    const { userId, leadId } = req.body;
    
    // Verificar si el usuario y el lead existen
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    
    if (!user || !lead) {
      return res.status(404).json({ message: 'Usuario o lead no encontrado' });
    }

    // Crear la asignación en UsersOnLeads
    await prisma.assignment.create({
      data: {
        userId: userId,
        leadId: leadId
      },
    });

    // Actualizar el campo userId en el lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { userId: userId },
    });

    res.status(200).json({ message: 'Promotor asignado al lead correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar usuario al lead', error: error.message });
  }
});

// Mostrar historial de asignaciones por lead
router.get('/lead/history/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Verificar si el lead existe
    const lead = await prisma.lead.findUnique({
      where: {
        id: id
      }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }

    const history = await prisma.assignment.findMany({
      where: {
        leadId: id
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Obtener los nombres de usuario para cada asignación
    for (let i = 0; i < history.length; i++) {
      const user = await prisma.user.findUnique({
        where: {
          id: history[i].userId
        }
      });
      history[i].name = user.name; // Agregar el nombre de usuario a cada objeto de historial
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
});

// Reasignar promotor al lead
router.put('/lead/reassign/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userId } = req.body;

    // Verificar si el usuario y el lead existen
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const lead = await prisma.lead.findUnique({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!lead) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }

    // Actualizar el campo userId en el lead
    await prisma.lead.update({
      where: { id: id },
      data: { userId: userId }
    });

    // Crear la asignación en UsersOnLeads
    await prisma.assignment.create({
      data: {
        userId: userId,
        leadId: id
      }
    });

    res.status(200).json({ message: 'Promotor actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar promotor', error: error.message });
  }
});

export default router;
