# Usamos la imagen oficial de Node.js basada en Alpine Linux
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar todo el código fuente, incluyendo el archivo .env.production que subimos a GitHub
COPY . .

# Construir la aplicación Next.js para producción
RUN npm run build

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
