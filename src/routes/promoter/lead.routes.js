import express from "express";
import { prisma } from "../../db.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Consultar leads del promotor
// Consultar leads del promotor con filtros y paginación
router.get("/promoter/:id/leads", async (req, res) => {
  const { id } = req.params;

  try {
    const {
      name,
      tel,
      email,
      career,
      country,
      state,
      city,
      formerSchool,
      enrollmentStatus,
      followId,
      contactMediumId,
      asetNameId,
      schoolYearId,
      campaignId,
      referenceType,
      typeSchool,
      skip,
      take,
    } = req.query;

    const where = {
      userId: parseInt(id),
    };

    switch (true) {
      case !!name:
        where.name = {
          contains: name.toLocaleLowerCase(),
        };
        break;
      case !!tel:
        where.OR = [
          {
            tel: {
              contains: tel.toLocaleLowerCase(),
            },
          },
          {
            telOptional: {
              contains: tel.toLocaleLowerCase(),
            },
          },
        ];
        break;
      case !!email:
        where.OR = [
          {
            email: {
              contains: email.toLocaleLowerCase(),
            },
          },
          {
            emailOptional: {
              contains: email.toLocaleLowerCase(),
            },
          },
        ];
        break;
      case !!career:
        where.career = {
          contains: career.toLocaleLowerCase(),
        };
        break;
      case !!country:
        where.country = {
          contains: country.toLocaleLowerCase(),
        };
        break;
      case !!state:
        where.state = {
          contains: state.toLocaleLowerCase(),
        };
        break;
      case !!city:
        where.city = {
          contains: city.toLocaleLowerCase(),
        };
        break;
      case !!formerSchool:
        where.formerSchool = {
          contains: formerSchool.toLocaleLowerCase(),
        };
        break;
      case !!enrollmentStatus:
        where.enrollmentStatus = enrollmentStatus;
        break;
      case !!followId:
        where.followId = parseInt(followId);
        break;
      case !!contactMediumId:
        where.contactMediumId = parseInt(contactMediumId);
        break;
      case !!asetNameId:
        where.asetNameId = parseInt(asetNameId);
        break;
      case !!campaignId:
        where.campaignId = parseInt(campaignId);
        break;
      case !!schoolYearId:
        where.schoolYearId = parseInt(schoolYearId);
        break;
      case !!referenceType:
        where.referenceType = referenceType;
        break;
      case !!typeSchool:
        where.typeSchool = typeSchool;
        break;
    }

    const leads = await prisma.lead.findMany({
      skip: +skip || 0,
      take: +take || 10,
      orderBy: {
        id: "desc",
      },
      where,
      include: {
        followUp: true,
        grade: true,
        contactMedium: true,
        asetName: true,
        campaign: true,
        schoolYear: true,
      },
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error al obtener leads por promoter id:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear un lead
router.post("/promoter/lead", async (req, res) => {
  try {
    const { enrollmentStatus, followId, userId, ...leadData } = req.body;

    if (!enrollmentStatus || !followId || !userId) {
      return res.status(400).send("Status, Seguimiento y Promotor son campos obligatorios");
    }

    // Verificar que exista el usuario con el ID proporcionado
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).send("El usuario con el ID proporcionado no fue encontrado");
    }

    // Formatear la fecha actual en formato 'YYYY-MM-DD'
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Crear un nuevo lead con la fecha de primer contacto
    const newLead = await prisma.lead.create({
      data: {
        ...leadData,
        enrollmentStatus,
        followId: parseInt(followId),
        userId: parseInt(userId),
        dateFirstContact: new Date(Date.now()).toISOString(),
        created_at: formattedDate,
        updated_at: formattedDate,
      },
    });

    // Crear un registro en la tabla Assignment para el historial de asignación
    await prisma.assignment.create({
      data: {
        userId: parseInt(userId),
        leadId: newLead.id,
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error("Error al crear un Lead: ", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Contador de registros
router.get("/promoter/:id/leads/count", async (req, res) => {
  const { id } = req.params;

  try {
    const total = await prisma.lead.count({
      where: {
        userId: parseInt(id),
      },
    });

    res.status(200).json(total);
  } catch (error) {
    console.error("Error al obtener el total de leads por promoter id:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
