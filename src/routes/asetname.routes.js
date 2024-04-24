import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// Consultar todas los aset name
router.get("/aset-names", async (req, res) => {
  try {
    const asetName = await prisma.asetName.findMany({
      skip: +req.query.skip,
      take: +req.query.take,
      orderBy: {
        id: "desc",
      },
      include: {
        contactMedium: {
          include: true,
        },
      },
    });
    res.status(200).json(asetName);
  } catch (error) {
    console.error("Error al encontrar los Aset Names:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear un aset name
router.post("/aset-name", async (req, res) => {
  try {
    const { name, mediumId } = req.body;

    const existingAsetName = await prisma.asetName.findFirst({
      where: {
        name: name,
        mediumId: mediumId,
      },
    });

    if (existingAsetName) {
      return res
        .status(400)
        .json({
          mensaje: "Aset Name con este nombre y medio de contacto ya existe.",
        });
    }

    const newAsetName = await prisma.asetName.create({
      data: {
        name: name,
        mediumId: mediumId,
      },
    });

    res.status(201).json(newAsetName);
  } catch (error) {
    console.error("Error al crear un aset name:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Consultar un aset name
router.get("/aset-name/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si existe el rol mediante su id
    const asetName = await prisma.asetName.findUnique({
      where: { id: parseInt(id) },
    });

    if (!asetName) {
      return res.status(404).json({ message: "Aset Name no encontrado" });
    }

    res.status(200).json(asetName);
  } catch (error) {
    console.error("Error al obtener un Aset Name:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar un aset name
router.put("/aset-name/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Campos que se actualizaran
    const { name, mediumId } = req.body;

    // Validar que al menos un campo sea proporcionado
    if (!name || !mediumId) {
      return res
        .status(400)
        .json({ error: "Se requiere al menos un campo para actualizar." });
    }

    const existingAsetName = await prisma.asetName.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingAsetName) {
      return res.status(404).json({ error: "Aset Name no encontrado." });
    }

    const existingAtrributes = await prisma.asetName.findFirst({
      where: {
        AND: [
          {
            name: name,
            mediumId: mediumId,
          },
          {
            NOT: {
              id: parseInt(id),
            },
          },
        ],
      },
    });

    if (existingAtrributes) {
      return res
        .status(400)
        .json({
          error:
            "Ya existe un aset-name con este nombre y/o medio de contacto.",
        });
    }

    const updatedAsetName = await prisma.asetName.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        mediumId,
      },
    });

    res.status(200).json(updatedAsetName);
  } catch (error) {
    console.error("Error al actualizar un aset name: ", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Contador de registros
router.get("/aset-names/total", async (req, res) => {
  try {
    const total = await prisma.asetName.count();

    res.status(200).json(total);
  } catch (error) {
    console.error("Error obtener el total de aset names:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener el listado de aset names
router.get('/aset-names/list', async (req, res) => {
  try {
      const asetNames = await prisma.asetName.findMany();
      res.status(200).json(asetNames);
  } catch (error) {
      console.error('Error al encontrar los aset names:', error);
      res.status(500).send('Error interno del servidor');
  }
});

// Obtener el listado de aset names mediante su medio de contacto
router.get("/contact-mediums/:id/aset-names", async (req, res) => {
  const { id } = req.params;

  try {
    const asetNames = await prisma.asetName.findMany({
      where: {
        mediumId: parseInt(id),
      },
    });

    res.json(asetNames);
  } catch (error) {
    console.error("Error al obtener los Aset Names:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
