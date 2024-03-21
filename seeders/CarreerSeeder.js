import { prisma } from "../src/db.js";

async function seed() {
    try {
        const careers = [
            { name: "Psicología", slug: "LPS" },
            { name: "Derecho", slug: "LED" },
            { name: "Pedagogía", slug: "LPE" },
            { name: "Ciencias Políticas y Gestión Pública", slug: "LCP" },
            { name: "Relaciones Internacionales", slug: "LRI" },
            { name: "Relaciones Internacionales y Economía", slug: "RIEC" },
            { name: "Relaciones Internacionales y Ciencias Políticas", slug: "RICP" },
            { name: "Idiomas", slug: "LID" },
            { name: "Comunicación", slug: "LCO" },
            { name: "Comunicación y Relaciones Públicas", slug: "CORP" },
            { name: "Comercio Exterior", slug: "LCE" },
            { name: "Economía y Finanzas", slug: "LEF" },
            { name: "Mercadotecnia", slug: "LEM" },
            { name: "Mercadotecnia y Publicidad", slug: "LEMP" },
            { name: "Psicología Organizacional", slug: "LPO" },
            { name: "Administración de Empresas Turísticas", slug: "LAET" },
            { name: "Administración de Empresas", slug: "LAE" },
            { name: "Administración de Negocios Internacionales", slug: "LANI" },
            { name: "Administración Pública", slug: "LAP" },
            { name: "Administración y Mercadotecnia", slug: "LAM" },
            { name: "Diseño de Modas y Tendencias Internacionales", slug: "LDM" },
            { name: "Diseño Industrial", slug: "LDI" },
            { name: "Diseño Gráfico", slug: "LDG" },
            { name: "Animación y Diseño Digital", slug: "LADD" },
            { name: "Arquitectura", slug: "ARQ" },
            { name: "Civil", slug: "ICI" },
            { name: "Mecatrónica", slug: "IME" },
            { name: "Mecánica Industrial", slug: "IMI" },
            { name: "Industrial y de Sistemas de Calidad", slug: "IISCA" },
            { name: "Sistemas Computacionales", slug: "ISC" },
            { name: "Ambiental", slug: "IAM" },
            { name: "Gestión Empresarial", slug: "LEGE" },
            { name: "Mercadotecnia", slug: "LEMK" },
            { name: "Administración de Negocios Internacionales", slug: "LEANI" },
            { name: "Administración y Mercadotecnia", slug: "LEAM" },
            { name: "Mercadotecnia y Publicidad", slug: "LEMKP" },
            { name: "Comercio Exterior", slug: "LECE" }
        ];

        for (const career of careers) {
            const existingCareer = await prisma.carreer.findUnique({
                where: { name: career.name }
            });

            if (!existingCareer) {
                await prisma.carreer.create({
                    data: career,
                });
                console.log(`Carrera ${career.name} creada`);
            } else {
                console.log(`La carrera ${career.name} ya existe en la base de datos`);
            }
        }

        console.log("Seeding completed successfully");
    } catch (error) {
        console.error("Error durante el seeding:", error);
    } finally {
        // Cerrar la conexión a la base de datos
        await prisma.$disconnect();
    }
}

seed();
