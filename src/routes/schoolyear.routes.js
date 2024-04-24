import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

// Consultar todas los ciclos escolares
router.get("/school-years", async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};

    switch (true) {
      case !!status:
        where.status = status === "true"; // Convertir a booleano
        break;
    }

    const schoolYears = await prisma.schoolYear.findMany({
      skip: +req.query.skip,
      take: +req.query.take,
      orderBy: {
        id: "desc",
      },
      where,
    });

    res.status(200).json(schoolYears);
  } catch (error) {
    console.error("Error al encontrar los ciclos escolares:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear un ciclo escolar
router.post("/school-year", async (req, res) => {
  try {
    const { cicle, status } = req.body;

    const existingSchoolYear = await prisma.schoolYear.findFirst({
      where: {
        cicle: cicle,
        status: status,
      },
    });

    if (existingSchoolYear) {
      return res.status(400).json({ mensaje: "Ciclo escolar ya existente." });
    }

    const newSchoolYear = await prisma.schoolYear.create({
      data: {
        cicle: cicle,
        status: status,
      },
    });

    res.status(201).json(newSchoolYear);
  } catch (error) {
    console.error("Error al crear un ciclo escolar:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Consultar un ciclo escolar
router.get("/school-year/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const schoolYear = await prisma.schoolYear.findUnique({
      where: { id: parseInt(id) },
    });

    if (!schoolYear) {
      return res.status(404).json({ message: "Ciclo escolar no encontrado" });
    }

    res.status(200).json(schoolYear);
  } catch (error) {
    console.error("Error al obtener un ciclo escolar:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar una campaña
router.put("/school-year/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Campos que se actualizaran
    const { cicle, status } = req.body;

    // Validar que al menos un campo sea proporcionado
    if (!cicle && !status) {
      return res
        .status(400)
        .json({ error: "Se requiere al menos un campo para actualizar." });
    }

    const existingSchoolYear = await prisma.schoolYear.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingSchoolYear) {
      return res.status(404).json({ error: "Ciclo escolar no encontrado." });
    }

    const existingAtrributes = await prisma.schoolYear.findFirst({
      where: {
        cicle: cicle,
        status: status,
      },
    });

    if (existingAtrributes) {
      return res.status(400).json({
        error: "Ya existe un ciclo escolar con este nombre y/o tipo.",
      });
    }

    const updatedSchoolYear = await prisma.schoolYear.update({
      where: {
        id: parseInt(id),
      },
      data: {
        cicle,
        status: status !== undefined ? status : true,
      },
    });

    res.status(200).json(updatedSchoolYear);
  } catch (error) {
    console.error("Error al actualizar un ciclo escolar: ", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Contador de registros
router.get("/school-years/total", async (req, res) => {
  try {
    const total = await prisma.schoolYear.count();

    res.status(200).json(total);
  } catch (error) {
    console.error("Error obtener el total de ciclos escolares:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener el listado de campañas
router.get("/school-years/list", async (req, res) => {
  try {
    const schoolYears = await prisma.schoolYear.findMany({
      where: {
        status: true
      }
    });
    res.status(200).json(schoolYears);
  } catch (error) {
    console.error("Error al encontrar los ciclos escolares:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
