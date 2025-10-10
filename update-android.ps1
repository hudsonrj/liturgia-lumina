# Script para atualizar o projeto Android

Write-Host "🚀 Iniciando atualização do Android..." -ForegroundColor Green

# Limpar cache do npm
Write-Host "🧹 Limpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force

# Remover node_modules e package-lock.json
Write-Host "🗑️ Removendo node_modules e package-lock.json..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Construir o projeto
Write-Host "🏗️ Construindo o projeto..." -ForegroundColor Yellow
npm run build

# Limpar projeto Android
Write-Host "🧹 Limpando projeto Android..." -ForegroundColor Yellow
npm run android:clean

# Sincronizar com Capacitor
Write-Host "🔄 Sincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync

# Abrir Android Studio
Write-Host "💻 Abrindo Android Studio..." -ForegroundColor Yellow
npx cap open android

Write-Host "✅ Processo concluído!" -ForegroundColor Green
Write-Host "📱 Abra o Android Studio e execute o projeto" -ForegroundColor Green 