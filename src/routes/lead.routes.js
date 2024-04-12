import express from "express";
import { prisma } from "../db.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Consultar todos los PSeguimientos
router.get("/leads", async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        campaign: true,
        followUp: true,
        grade: true,
        carreer: true,
        user: true,
      },
    });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error al encontrar los leads:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear un lead
router.post("/lead", async (req, res) => {
  try {
    const leadData = req.body;

    // Verificar si ya existe un lead con el mismo email
    const existingEmail = await prisma.lead.findFirst({
      where: {
        email: leadData.email,
      },
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ errorEmail: "Ya existe un lead con este email." });
    }

    // Verificar si ya existe un lead con el mismo número de teléfono
    const existingTel = await prisma.lead.findFirst({
      where: {
        tel: leadData.tel,
      },
    });

    if (existingTel) {
      return res
        .status(400)
        .json({ errorTel: "Ya existe un lead con este número de teléfono." });
    }

    // Formatear la fecha actual en formato 'YYYY-MM-DD'
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Crear un nuevo lead si no existe un lead con los datos proporcionados
    const newLead = await prisma.lead.create({
      data: {
        ...leadData,
        created_at: formattedDate,
        updated_at: formattedDate,
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error("Error al crear un Lead: ", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Consultar un lead por su ID
router.get("/lead/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await prisma.lead.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        campaign: true,
        followUp: true,
        grade: true,
        carreer: true,
        user: true,
      },
    });

    if (lead) {
      res.status(200).json(lead);
    } else {
      res.status(404).json({ error: "lead no encontrado." });
    }
  } catch (error) {
    console.error("Error al obtener lead: ", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar un lead
router.put("/lead/:id", async (req, res) => {
  const leadId = parseInt(req.params.id);
  const leadUpdates = req.body;

  try {
    // Busca el lead por su ID
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    // Si no se encuentra el lead, devuelve un error
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Verifica si dateFirstContact es nulo
    if (lead.dateFirstContact === null) {
      // Establece dateFirstContact en la fecha actual
      leadUpdates.dateFirstContact = new Date();
    }

    // Actualiza el lead con los datos proporcionados en el cuerpo de la solicitud
    const updatedLead = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: leadUpdates,
    });

    // Devuelve el lead actualizado
    res.json(updatedLead);
  } catch (error) {
    // Manejo de errores
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Error updating lead" });
  }
});

// Carga de archivos csv
router.post("/lead/upload", upload.single("file"), async (req, res) => {
  try {
    // Verificar si se subió un archivo
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se ha cargado ningún archivo." });
    }

    const allowedExtensions = ["csv"];
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res
        .status(400)
        .json({ error: "El archivo no tiene una extensión permitida." });
    }

    // Leer el archivo CSV subido
    const results = [];
    const csvData = req.file.buffer.toString();
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(",");
      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = line[j].trim();
      }
      results.push(entry);
    }

    // Procesar los datos y realizar la inserción en la base de datos
    for (const result of results) {
      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: [{ tel: result.tel }, { email: result.email }],
        },
      });

      if (existingLead) {
        return res.status(400).json({
          error: `El teléfono "${result.tel}" y/o correo electrónico "${result.email}" ya están registrados.`,
        });
      }

      const leadData = {
        name: result.name,
        tel: result.tel,
        telOptional: result.telOptional || null,
        email: result.email,
        emailOptional: result.emailOptional || null,
        genre: result.genre || null,
        dateFirstContact: result.dateFirstContact || null,
        dateBirth: result.dateBirth || null,
        formerSchool: result.formerSchool || null,
        typeSchool: result.typeSchool || null,
        country: result.country || null,
        state: result.state || null,
        city: result.city || null,
        asetNameForm: result.asetNameForm || null,
        isOrganic: result.isOrganic || null,
        referenceType: result.referenceType || null,
        referenceName: result.referenceName || null,
        enrollmentDate: result.enrollmentDate || null,
        scholarship: result.scholarship || null,
        enrollmentStatus: result.enrollmentStatus || null,
        admissionSemester: result.admissionSemester || null,
        schoolYear: result.schoolYear || null,
        created_at: result.created_at,
        updated_at: result.created_at,
        campaign: {},
        followUp: {},
        grade: {},
        carreer: {},
        user: {},
      };

      if (result.campaignId) {
        leadData.campaign.connect = { id: parseInt(result.campaignId) };
      }

      if (result.followId) {
        leadData.followUp.connect = { id: parseInt(result.followId) };
      }

      if (result.gradeId) {
        leadData.grade.connect = { id: parseInt(result.gradeId) };
      }

      if (result.carreerId) {
        leadData.carreer.connect = { id: parseInt(result.carreerId) };
      }

      if (result.userId) {
        leadData.user.connect = { id: parseInt(result.userId) };
      }

      await prisma.lead.create({
        data: leadData,
      });
    }

    res.status(201).json({ message: "Datos insertados correctamente" });
  } catch (error) {
    console.error("Error al procesar el archivo CSV:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// lead por promoter id
router.get("/lead/promoter/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const leads = await prisma.lead.findMany({
      where: {
        userId: parseInt(id),
      },
      include: {
        campaign: true,
        followUp: true,
        grade: true,
        carreer: true,
        user: true,
      },
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error al obtener leads por promoter id:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
