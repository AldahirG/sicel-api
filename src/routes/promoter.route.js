import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/promoters', async (req, res) => {
  try {
    const promoters = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              id: 2
            }
          }
        }
      }
    });

    const promotersWithoutPassword = promoters.map(promoter => {
      delete promoter.password;
      return promoter;
    });

    res.status(200).json(promotersWithoutPassword);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los promotores' });
  }
});

export default router;