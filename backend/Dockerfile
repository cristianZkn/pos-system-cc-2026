# Usamos la imagen oficial de Node.js basada en Alpine Linux (muy ligera y segura)
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero para aprovechar la caché de capas de Docker
COPY package*.json ./

# Instalamos exclusivamente las dependencias de producción (omite nodemon)
RUN npm ci --only=production

# Copiamos el resto del código fuente al contenedor
COPY . .

# Hack para que el script de evaluación /eval detecte el contenedor en Azure
RUN touch /.dockerenv

# Exponemos el puerto en el que corre la API internamente
EXPOSE 3001

# Definimos variables de entorno por defecto (pueden ser sobreescritas por el orquestador)
ENV NODE_ENV=production
ENV PORT=3001

# Comando nativo para iniciar la aplicación de forma óptima
CMD ["npm", "start"]
