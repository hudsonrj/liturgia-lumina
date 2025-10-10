# Imagem base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Instalar o Capacitor
RUN npm install @capacitor/cli @capacitor/core @capacitor/android

# Expor a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"] 