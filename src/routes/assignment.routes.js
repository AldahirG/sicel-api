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

    // Verificar si el lead ya tiene un userId asignado
    if (lead.userId) {
      return res.status(400).json({ message: 'El lead ya tiene un promotor asignado' });
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

// Asignación múltiple
router.post('/leads/assign', async (req, res) => {
  try {
    const { userId, leadIds } = req.body;

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si los leads existen
    const leads = await prisma.lead.findMany({ where: { id: { in: leadIds } } });
    if (leads.length !== leadIds.length) {
      return res.status(404).json({ message: 'Algunos leads no encontrados' });
    }

    // Crear las asignaciones en UsersOnLeads
    const assignments = leadIds.map((leadId) => {
      return prisma.assignment.create({
        data: {
          userId: userId,
          leadId: leadId
        },
      });
    });
    
    await Promise.all(assignments);

    // Actualizar el campo userId en los leads
    const updateLeads = leadIds.map((leadId) => {
      return prisma.lead.update({
        where: { id: leadId },
        data: { userId: userId },
      });
    });

    await Promise.all(updateLeads);

    res.status(200).json({ message: 'Promotor asignado a los leads correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar usuario a los leads', error: error.message });
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

    // Verificar si el userId es diferente al usuario actual
    if (lead.userId === userId) {
      return res.status(400).json({ message: 'No puedes reasignar al mismo promotor' });
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
