<div align="center">

# 🏋️‍♂️ Gym Management Platform

### Plataforma Moderna de Gestión de Gimnasios con Suscripciones

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-5.26.0-8E75FF?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Sistema completo de gestión para gimnasios con suscripciones recurrentes, catálogo de actividades y pagos integrados con MercadoPago**

[Demo](#) · [Reportar Bug](https://github.com/yourusername/strapi-mini/issues) · [Solicitar Feature](https://github.com/yourusername/strapi-mini/issues)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 💳 **Sistema de Suscripciones**
- ✅ Planes personalizables (Básico, Pro, Elite)
- ✅ Pagos recurrentes con MercadoPago
- ✅ Gestión de estados de suscripción
- ✅ URLs de checkout directo

</td>
<td width="50%">

### 🏋️ **Gestión de Actividades**
- ✅ Catálogo dinámico de actividades
- ✅ Carousel interactivo con imágenes
- ✅ Iconos personalizables
- ✅ Ordenamiento flexible

</td>
</tr>
<tr>
<td width="50%">

### 🎯 **Sistema de Beneficios**
- ✅ Tarjetas animadas (WobbleCard)
- ✅ Tags y categorización
- ✅ Contenido dinámico desde CMS
- ✅ Responsive design

</td>
<td width="50%">

### ⚡ **Performance Optimizado**
- ✅ ISR con revalidación de 60s
- ✅ Next.js 15 + Turbopack
- ✅ Code splitting automático
- ✅ Optimización de imágenes

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### **Frontend**
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js) | 15.5.4 | Framework React con SSR/ISR |
| ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react) | 19.1.0 | Librería UI component-based |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) | 5.x | Type-safe JavaScript |
| ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css) | 4.x | Utility-first CSS framework |
| ![Motion](https://img.shields.io/badge/Motion-11.14-FF0080) | 11.14 | Animaciones fluidas |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?logo=radix-ui) | Latest | Componentes accesibles |

### **Backend**
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![Strapi](https://img.shields.io/badge/Strapi-5.26.0-8E75FF?logo=strapi) | 5.26.0 | Headless CMS |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql) | Latest | Base de datos producción |
| ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite) | 3.x | Base de datos desarrollo |
| ![Node.js](https://img.shields.io/badge/Node.js-18--22-339933?logo=node.js) | 18-22 | Runtime JavaScript |

### **Integraciones**
- 💳 **MercadoPago SDK** - Procesamiento de pagos y suscripciones
- 🎨 **Embla Carousel** - Sliders de actividades
- 📝 **React Hook Form + Zod** - Validación de formularios
- 🗂️ **Zustand** - State management

---

## 📸 Screenshots

> 🚧 _Screenshots próximamente_

---

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- npm o yarn
- PostgreSQL (producción) o SQLite (desarrollo)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/yourusername/strapi-mini.git
cd strapi-mini

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Instalar dependencias del frontend
cd ../frontend
npm install

# 4. Volver a la raíz
cd ..
```

### Configuración

#### Backend (.env)

```env
# Server
HOST=0.0.0.0
PORT=1337

# Database (SQLite para desarrollo)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Database (PostgreSQL para producción)
# DATABASE_CLIENT=postgres
# DATABASE_HOST=your-host
# DATABASE_PORT=5432
# DATABASE_NAME=your-db
# DATABASE_USERNAME=your-user
# DATABASE_PASSWORD=your-password
# DATABASE_SSL=true

# Secrets
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=your-access-token
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Iniciar Desarrollo

```bash
# Terminal 1: Backend (Strapi)
cd backend
npm run develop

# Terminal 2: Frontend (Next.js)
cd frontend
npm run dev
```

🎉 **Aplicación corriendo:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Admin: [http://localhost:1337/admin](http://localhost:1337/admin)

---

## 📚 API Endpoints

### Principales Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/plans` | GET | Obtener planes de suscripción |
| `/api/subscriptions` | GET/POST | Gestionar suscripciones |
| `/api/gym-activities` | GET | Actividades del gimnasio |
| `/api/beneficios` | GET | Beneficios/características |
| `/api/home-page` | GET | Contenido página principal |

### Ejemplo de Uso

```typescript
// Obtener planes desde el frontend
import { getPlans } from '@/data/actions/strapi';

const plansData = await getPlans();
const plans = plansData?.data || [];
```

---

## 🎨 Componentes Principales

### Frontend Components

```
frontend/src/components/
├── carousel/
│   └── GymActivitiesCarousel.tsx    # Carousel de actividades
├── hero/
│   └── HeroSection.tsx              # Sección hero principal
├── planHeroSection/
│   └── PlanHeroSection.tsx          # Showcase de planes
├── ui/
│   ├── WobbleCardDemo.tsx           # Tarjetas animadas beneficios
│   ├── wobble-card.tsx              # Componente WobbleCard base
│   └── navbar-demo.tsx              # Navegación responsive
└── ctaSection/
    └── CTASection.tsx               # Call-to-action
```

### Estructura de Content Types (Strapi)

```
backend/src/api/
├── plan/                   # Planes de suscripción
├── subscription/           # Suscripciones activas
├── gym-activity/          # Actividades del gym
├── beneficio/             # Beneficios/features
├── home-page/             # Contenido homepage
└── planes-link/           # URLs MercadoPago
```

---

## 🚢 Deployment

### Backend (Railway)

```bash
# Build command
npm install && npm run build

# Start command
npm run start
```

### Frontend (Vercel)

```bash
# Auto-detecta Next.js
# Configurar variables de entorno en dashboard
```

### Variables de Entorno Requeridas

**Railway (Backend):**
- DATABASE_* (PostgreSQL credentials)
- APP_KEYS, JWT_SECRET, etc.
- MERCADO_PAGO_ACCESS_TOKEN

**Vercel (Frontend):**
- NEXT_PUBLIC_STRAPI_URL
- NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 🎉

### Proceso de Contribución

1. **Fork** el proyecto
2. **Crea** tu feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'Add: amazing new feature'
   ```
4. **Push** a tu branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Abre** un Pull Request

### Guías de Estilo

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de Prettier/ESLint
- Escribe commits descriptivos en español o inglés
- Documenta nuevos componentes y funciones

---

## 📝 Roadmap

- [ ] Panel de administración de usuarios
- [ ] Sistema de notificaciones
- [ ] App móvil con React Native
- [ ] Integración con calendarios
- [ ] Sistema de reservas de clases
- [ ] Dashboard de analytics

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Strapi Mini Gym

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 💪 Autor

**Tu Nombre**
- GitHub: [@yourusername](https://github.com/AgusMolinaCode)

---

## 🌟 Agradecimientos

- [Strapi](https://strapi.io/) - Headless CMS increíble
- [Vercel](https://vercel.com/) - Next.js deployment platform
- [Railway](https://railway.app/) - Backend hosting
- [MercadoPago](https://www.mercadopago.com/) - Procesador de pagos
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

### ⭐ Si te gustó este proyecto, dale una estrella!

**Hecho con ❤️ y ☕ por [Tu Nombre]**

</div>
