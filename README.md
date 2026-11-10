# Aurora — Preview de lançamento

Página de prévia de desenvolvimento com contagem regressiva em tempo real, slideshow de imagens ao fundo e alternância entre temas claro e escuro. Construída com React, Vite, Tailwind CSS e componentes no estilo shadcn/ui. O build é servido por nginx em um container Docker, e o conteúdo é configurado por variáveis de ambiente em tempo de execução.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- Docker multi-stage + nginx
- Configuração de nome, descrição, data, URL e diretórios de imagens via variáveis de ambiente
- Tema claro/escuro com preferência salva no navegador

## Desenvolvimento

```bash
npm install
npm run dev
```

Para personalizar a prévia localmente, crie um `.env` a partir do `.env.example` e preencha as variáveis `VITE_*`. O diretório do slideshow usa `SYSTEM_BACKGROUND_DIRS` tanto no desenvolvimento quanto no container.

## Deploy com Docker

```bash
cp .env.example .env
docker compose up --build -d
```

A página estará disponível em `http://localhost:8080` (ajuste `APP_PORT` no `.env`).

### Variáveis de ambiente

| Variável             | Descrição                                                                 |
| -------------------- | ------------------------------------------------------------------------- |
| `SYSTEM_NAME`        | Nome exibido no cabeçalho, título e rodapé                                |
| `SYSTEM_DESCRIPTION` | Texto de apresentação do sistema                                          |
| `SYSTEM_START_DATE`  | Data/hora de disponibilidade em ISO 8601 (idealmente com fuso, ex. `-03:00`) |
| `SYSTEM_URL`         | Link exibido no botão "Acessar sistema" após a data de lançamento         |
| `SYSTEM_BACKGROUND_DIRS` | Um ou mais diretórios de imagens, separados por vírgula (padrão `/backgrounds`) |
| `APP_PORT`           | Porta publicada no host (padrão `8080`)                                   |

As variáveis são injetadas em `/env-config.js` no start do container. Para aplicar novos valores, recrie o container:

```bash
docker compose up -d --force-recreate
```

Se a data de início já tiver passado, a página muda automaticamente para o estado "Disponível" e o relógio fica em `00:00:00`.

## Slideshow de fundo

As imagens ficam em `public/backgrounds` (ou em subdiretórios) e são exibidas com um véu acinzentado, filtros de dessaturação e transições suaves. O manifesto é gerado automaticamente a partir dos diretórios definidos em `SYSTEM_BACKGROUND_DIRS`, sem banco de dados:

```bash
SYSTEM_BACKGROUND_DIRS=/backgrounds/aurora,/backgrounds/campanha
```

- Formatos aceitos: `jpg`, `jpeg`, `png`, `webp` e `avif`.
- A ordem dos diretórios no env define a ordem dos grupos; dentro de cada diretório, os arquivos são ordenados por nome.
- O manifesto fica em `/backgrounds/manifest.json` e é regerado a cada start do container. Adicione imagens, ajuste o env e recrie o container.
- Em desenvolvimento, o plugin do Vite lê os mesmos diretórios a partir de `public/`.

Para usar um diretório externo no Docker, monte-o dentro do web root e inclua o caminho no env:

```yaml
services:
  preview:
    environment:
      SYSTEM_BACKGROUND_DIRS: /backgrounds,/backgrounds/extra
    volumes:
      - ./minhas-imagens:/usr/share/nginx/html/backgrounds/extra:ro
```

## Tema

O botão no cabeçalho alterna entre claro e escuro, salva a escolha em `localStorage` e, na primeira visita, respeita a preferência do sistema operacional.

## Branding

Os ícones, favicons, imagem Open Graph e backgrounds de exemplo ficam em `public/`. As fontes dos SVGs estão em `brand/` e os ícones podem ser regerados com:

```bash
npm run icons
```

Requisitos: Inkscape, curl e Pillow (Python). O script baixa as fontes usadas na imagem Open Graph para um cache local.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # typecheck + build de produção
npm run lint     # oxlint
npm run icons    # regenera favicons, ícones PWA e OG image
```
