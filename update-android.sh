#!/bin/bash

echo "🚀 Iniciando atualização do Android..."

# Limpar cache do npm
echo "🧹 Limpando cache do npm..."
npm cache clean --force

# Remover node_modules e package-lock.json
echo "🗑️ Removendo node_modules e package-lock.json..."
rm -rf node_modules package-lock.json

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Construir o projeto
echo "🏗️ Construindo o projeto..."
npm run build

# Limpar projeto Android
echo "🧹 Limpando projeto Android..."
npm run android:clean

# Sincronizar com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync

# Abrir Android Studio
echo "💻 Abrindo Android Studio..."
npx cap open android

echo "✅ Processo concluído!"
echo "📱 Abra o Android Studio e execute o projeto" 