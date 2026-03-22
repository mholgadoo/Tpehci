# Tpehci - Smart Home

Aplicación web de gestión de hogar inteligente construida con React, Vite y Tailwind CSS.

## Paso a paso para inicializar el proyecto

### 1. Instalar nvm (Node Version Manager)

**Linux / macOS:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Cerrar y volver a abrir la terminal para que se apliquen los cambios.

**Windows:**

Descargar el instalador desde [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) y seguir el instalador.

### 2. Instalar Node.js v20

```bash
nvm install 20
nvm use 20
```

Verificar que se instaló correctamente:

```bash
node -v
npm -v
```

### 3. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Tpehci.git
cd Tpehci
```

### 4. Instalar las dependencias

```bash
npm install
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`.

## Build de producción

```bash
npm run build
```

## Tecnologías principales

- React 18
- Vite 6
- Tailwind CSS 4
- Material UI
- Radix UI / shadcn/ui
- React Router
- React DnD
- Recharts
