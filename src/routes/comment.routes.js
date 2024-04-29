import express from 'express';
import { prisma } from '../db.js';

const router = express.Router();

// Consultar todos los comentarios de un lead
router.get('/admin/lead/:leadId/comments', async (req, res) => {
    try {
        const { leadId } = req.params;

        // Obtener todos los registros de LeadContact asociados al lead
        const leadContacts = await prisma.leadContact.findMany({
            where: {
                leadId: parseInt(leadId)
            }
        });

        // Obtener los IDs de los comentarios asociados a los registros de LeadContact
        const commentIds = leadContacts.map(leadContact => leadContact.contactId);

        // Obtener los comentarios asociados a los IDs obtenidos
        const comments = await prisma.contact.findMany({
            where: {
                id: { in: commentIds }
            }
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error al encontrar los comentarios del lead:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Agregar un comentario a un lead
router.post('/lead/:leadId/comment', async (req, res) => {
    try {
        const { leadId } = req.params;
        const { comment } = req.body;

        // Verificar si el lead existe
        const existingLead = await prisma.lead.findUnique({
            where: { id: parseInt(leadId) },
        });

        if (!existingLead) {
            return res.status(404).json({ message: 'Lead no encontrado' });
        }

        // Crear un nuevo contacto
        const newContact = await prisma.contact.create({
            data: {
                // Crear el comentario
                comment: comment,
            }
        });

        // Conectar el comentario al lead a través de LeadContact
        const newLeadContact = await prisma.leadContact.create({
            data: {
                leadId: parseInt(leadId),
                contactId: newContact.id // Usar el ID del nuevo contacto
            }
        });

        res.status(201).json(newContact);
    } catch (error) {
        console.error('Error al agregar un comentario al lead:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Actualizar un comentario de un lead
router.put('/lead/:leadId/comment/:commentId', async (req, res) => {
    try {
        const { leadId, commentId } = req.params;
        const { comment } = req.body;

        // Verificar si el lead existe
        const existingLead = await prisma.lead.findUnique({
            where: { id: parseInt(leadId) },
        });

        if (!existingLead) {
            return res.status(404).json({ message: 'Lead no encontrado' });
        }

        // Verificar si el comentario existe
        const existingComment = await prisma.contact.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Actualizar el comentario
        const updatedComment = await prisma.contact.update({
            where: { id: parseInt(commentId) },
            data: {
                comment: comment,
            },
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error al actualizar un comentario del lead:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar un comentario de un lead
router.delete('/lead/:leadId/comment/:commentId', async (req, res) => {
    try {
        const { leadId, commentId } = req.params;

        // Verificar si el lead existe
        const existingLead = await prisma.lead.findUnique({
            where: { id: parseInt(leadId) },
        });

        if (!existingLead) {
            return res.status(404).json({ message: 'Lead no encontrado' });
        }

        // Verificar si el comentario existe
        const existingComment = await prisma.contact.findUnique({
            where: { id: parseInt(commentId) },
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        // Eliminar el comentario
        await prisma.contact.delete({
            where: { id: parseInt(commentId) },
        });

        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar un comentario del lead:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;

