# SICEL - RESTAPI

Esta es la API para el proyecto de la Universidad Internacional llamadó SICEL, que se realizó con PRISMA y Express.js.

## Instalación

1. Clonar el repositorio **'git clone url del proyecto'**.
2. Instalar las dependencias **'npm i o npm install'**.
3. Configurar el archivo .env y ejectur el comando **'npx prisma generate'** para que reconozca las variables de entorno.

## Uso

En el archivo 'src/index.js' tienes que importar las rutas que se encuentran dentro de la carpeta 
'src/routes/' y mandarlas a llamar.
La nomenclatura para las rutas tiene que ser en singular, inglés y con terminación '.routes.js'.

Ejemplo: 'user.routes.js'.

1. Para correr el servidor ejecuta el comando **'npm run dev'**
2. Para migrar un modelo ejecutar el comando **'npx prisma migrate dev'** y en el nombre de la migración
siempre iniciar con 'migration_' y la acción que realizas. **Usa minúsculas para nombrar la migración**

Ejemplos:
1. migration_table_user (Cuando creas un nuevo modelo)
2. migration_alter_table_user (Cuando editas algún campo del modelo)
3. migration_delete_table_user (Cuando eliminas un modelo)

## Contribuciones

Crear una rama correspondiente y en dado caso de ya contar con una utilizarla y no usar la rama 'main'

## Créditos

- Aldahir
- Milton Jaimes
- Jonathan Andrés Martínez Rosas

## Información adicional
En este apartado te dejo la documentación oficial de Prisma **prisma.io**

1. Migrar con Prisma **https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql**
2. Relación muchos a muchos con tabla pivote **https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations**
3. Relación muchos a muchos sin tabla pivote **https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/working-with-many-to-many-relations#implicit-relations**

