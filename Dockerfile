# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción (Servidor Nginx)
FROM nginx:stable-alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
