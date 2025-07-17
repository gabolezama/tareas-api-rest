# Usa una imagen base de Python
FROM python:3.9-slim-buster

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de requerimientos e instala las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usará Tornado
EXPOSE 8888

# Comando por defecto para ejecutar la aplicación (será sobrescrito por docker-compose)
CMD ["python", "-m", "app.main"]