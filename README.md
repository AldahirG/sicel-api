# SICEL - RESTAPI

Esta es la API para el proyecto de la Uniersidad Internacional llamadó SICEL, que se realizó con PRISMA y Express.js.

## Instalación

1. Clonar el repositorio 'git clone nombre del proyecto'.
2. Instalar las dependencias 'npm i o npm install'.
3. Configurar el archivo .env y ejectura el comando 'npx prisma generate' para que reconozca las variables de entorno.

## Uso

En el archivo 'src/index.js' tienes que importar las rutas que se encuentran dentro de la carpeta 
'src/routes/' y mandarlas a llamar.
La nomenclatura para las rutas tiene que ser en singular, inglés y con terminación '.routes.js'.

Ejemplo: 'user.routes.js'.

1. Para correr el servidor ejecuta el comando **'npm run dev'**
2. Para migrar un modelo ejecutar el comando **'npx prisma migrate dev'** y en el nombre de la migración
siempre iniciar con 'migration_' y la acción que realizas. **Usa minúsculas para nombrar la migración**

Ejemplos:
1. migration_add_user_model
2. migration_alter_user_model

## Contribuciones

Crear una rama correspondiente y en dado caso de ya contar con una utilizarla y no usar la rama 'main'

## Créditos

- Aldahir
- Milton Jaimes
- Jonathan Andrés Martínez Rosas

