import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const data = [
	{ name: "Psicología", program: "LPS" },
    { name: "Derecho", program: "LED" },
    { name: "Pedagogía", program: "LPE" },
    { name: "Ciencias Políticas y Gestión Pública", program: "LCP" },
    { name: "Relaciones Internacionales", program: "LRI" },
    { name: "Relaciones Internacionales y Economía", program: "RIEC" },
    { name: "Relaciones Internacionales y Ciencias Políticas", program: "RICP" },
    { name: "Idiomas", program: "LID" },
    { name: "Comunicación", program: "LCO" },
    { name: "Comunicación y Relaciones Públicas", program: "CORP" },
    { name: "Comercio Exterior", program: "LCE" },
    { name: "Economía y Finanzas", program: "LEF" },
    { name: "Mercadotecnia", program: "LEM" },
    { name: "Mercadotecnia y Publicidad", program: "LEMP" },
    { name: "Psicología Organizacional", program: "LPO" },
    { name: "Administración de Empresas Turísticas", program: "LAET" },
    { name: "Administración de Empresas", program: "LAE" },
    { name: "Administración de Negocios Internacionales", program: "LANI" },
    { name: "Administración Pública", program: "LAP" },
    { name: "Administración y Mercadotecnia", program: "LAM" },
    { name: "Diseño de Modas y Tendencias Internacionales", program: "LDM" },
    { name: "Diseño Industrial", program: "LDI" },
    { name: "Diseño Gráfico", program: "LDG" },
    { name: "Animación y Diseño Digital", program: "LADD" },
    { name: "Arquitectura", program: "ARQ" },
    { name: "Civil", program: "ICI" },
    { name: "Mecatrónica", program: "IME" },
    { name: "Mecánica Industrial", program: "IMI" },
    { name: "Industrial y de Sistemas de Calidad", program: "IISCA" },
    { name: "Sistemas Computacionales", program: "ISC" },
    { name: "Ambiental", program: "IAM" },
    { name: "Gestión Empresarial", program: "LEGE" },
    { name: "Mercadotecnia", program: "LEMK" },
    { name: "Administración de Negocios Internacionales", program: "LEANI" },
    { name: "Administración y Mercadotecnia", program: "LEAM" },
    { name: "Mercadotecnia y Publicidad", program: "LEMKP" },
    { name: "Comercio Exterior", program: "LECE" },
]

export async function CareersSeeder() {
	const careers = await prisma.careers.createMany({
		data,
		skipDuplicates: true,
	})
}
