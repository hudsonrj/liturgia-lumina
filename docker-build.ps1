# Parar containers existentes
Write-Host "Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Remover imagens antigas
Write-Host "Removendo imagens antigas..." -ForegroundColor Yellow
docker-compose rm -f

# Construir a imagem
Write-Host "Construindo nova imagem..." -ForegroundColor Yellow
docker-compose build --no-cache

# Iniciar os containers
Write-Host "Iniciando containers..." -ForegroundColor Yellow
docker-compose up -d

# Mostrar logs
Write-Host "Mostrando logs..." -ForegroundColor Yellow
docker-compose logs -f 