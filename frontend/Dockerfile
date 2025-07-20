# Tareas/frontend/Dockerfile.frontend
# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa el servidor de desarrollo de React
EXPOSE 3000

# Comando para iniciar la aplicación (será sobrescrito por docker-compose)
CMD ["npm", "start"]