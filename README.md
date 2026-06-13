# Sistema POS — Evaluación de Módulo Cloud Computing

> **Instituto Profesional Virginia Gómez — 4° año Ingeniería (E) en Computación e Informática**
> Prof. Patricio Balboa

Sistema de Punto de Venta (POS) base para pymes chilenas. Esta aplicación es el **punto de partida monolítico** que cada equipo debe migrar a una arquitectura cloud moderna, resiliente y de alta disponibilidad.

---

## Stack tecnológico base

| Capa          | Tecnología                      |
|---------------|--------------------------------|
| Frontend      | Next.js 14 (React, App Router)  |
| Backend       | Node.js 18 + Express            |
| Base de Datos | PostgreSQL 14+                  |
| Autenticación | JWT con roles (admin / cajero)  |

---

## Módulos del sistema

| Módulo | Descripción | Acceso |
|--------|-------------|--------|
| **Dashboard** | KPIs: ventas del día, del mes, productos y clientes | Admin |
| **POS** | Carrito de compra, selección de cliente y método de pago | Admin / Cajero |
| **Productos** | CRUD con subida de imágenes y control de stock | Admin / Cajero |
| **Categorías** | Gestión de categorías de productos | Admin / Cajero |
| **Clientes** | CRUD con RUT chileno | Admin / Cajero |
| **Ventas** | Historial; anulación solo disponible para Admin | Admin / Cajero |
| **Reportes** | Gráficos de ventas por día, top productos y métodos de pago | Admin |
| **Usuarios** | Gestión de usuarios y roles | Admin |

---

## Estructura del proyecto

```
pos-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Conexión PostgreSQL
│   │   ├── controllers/             # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── clientController.js
│   │   │   ├── saleController.js
│   │   │   ├── reportController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT activo + control de roles
│   │   │   └── upload.js            # Multer — almacenamiento local
│   │   ├── routes/                  # Definición de rutas REST
│   │   ├── app.js                   # Express app
│   │   └── server.js
│   ├── uploads/                     # ⚠️ Imágenes en disco local — migrar a S3
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   └── (dashboard)/         # Layout con sidebar
│   │   │       ├── dashboard/
│   │   │       ├── pos/
│   │   │       ├── products/
│   │   │       ├── categories/
│   │   │       ├── clients/
│   │   │       ├── sales/
│   │   │       ├── reports/
│   │   │       └── users/
│   │   ├── components/
│   │   │   └── Sidebar.jsx          # Navegación filtrada por rol
│   │   └── lib/
│   │       ├── api.js               # Axios con interceptor JWT
│   │       └── utils.js             # Helpers (formatCLP, formatDate)
│   ├── jsconfig.json
│   ├── .env.local.example
│   └── package.json
├── database/
│   ├── schema.sql                   # DDL completo
│   ├── seed.sql                     # Datos de prueba
│   └── create-admin.js              # Script para crear usuarios iniciales
└── README.md
```

---

## Instalación y ejecución local

### Requisitos previos
- Node.js 18+
- PostgreSQL 14+
- npm

> Cada equipo elige cómo desplegar la aplicación: máquinas virtuales, contenedores, PaaS, etc. Las instrucciones siguientes corresponden a la ejecución directa con Node.js.

### 1 — Base de datos

```bash
# Crear la base de datos
createdb pos_db

# Ejecutar el schema
psql -d pos_db -f database/schema.sql

# Cargar datos de prueba
psql -d pos_db -f database/seed.sql
```

### 2 — Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear usuarios iniciales (admin y cajero)
node ../database/create-admin.js

# Iniciar el servidor (desarrollo)
npm run dev
```

El backend queda disponible en `http://localhost:3001`

### 3 — Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Iniciar el servidor (desarrollo)
npm run dev
```

El frontend queda disponible en `http://localhost:3000`

### Credenciales por defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@pos.cl` | `admin123` |
| Cajero | `cajero@pos.cl` | `cajero123` |

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET`  | `/api/auth/me` | Perfil del usuario autenticado |
| `GET`  | `/api/products` | Listar productos (filtros: `search`, `categoria_id`) |
| `POST` | `/api/products` | Crear producto (multipart/form-data) |
| `PUT`  | `/api/products/:id` | Actualizar producto |
| `DELETE` | `/api/products/:id` | Soft-delete producto |
| `GET`  | `/api/categories` | Listar categorías |
| `POST` | `/api/categories` | Crear categoría |
| `PUT`  | `/api/categories/:id` | Actualizar categoría |
| `GET`  | `/api/clients` | Listar clientes (filtro: `search`) |
| `POST` | `/api/clients` | Crear cliente |
| `PUT`  | `/api/clients/:id` | Actualizar cliente |
| `GET`  | `/api/sales` | Listar ventas |
| `GET`  | `/api/sales/:id` | Detalle de venta con items |
| `POST` | `/api/sales` | Crear venta (descuenta stock, transaccional) |
| `PUT`  | `/api/sales/:id/cancel` | Anular venta (repone stock) |
| `GET`  | `/api/reports/summary` | KPIs del dashboard |
| `GET`  | `/api/reports/sales-by-day` | Ventas por día (param: `days`) |
| `GET`  | `/api/reports/top-products` | Top productos (param: `limit`) |
| `GET`  | `/api/reports/sales-by-payment` | Distribución por método de pago |
| `GET`  | `/api/users` | Listar usuarios |
| `POST` | `/api/users` | Crear usuario |
| `PUT`  | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Desactivar usuario |

---

## ⚠️ Limitaciones conocidas — TODO para los equipos

Este sistema fue desarrollado **intencionalmente** con las siguientes limitaciones que representan los desafíos típicos de un monolito sin preparación cloud. Identificarlas, justificarlas y resolverlas en la arquitectura cloud es parte central de la evaluación.

### Seguridad
- [x] **Credenciales con fallback hardcodeado** — Ahora se exigen estrictamente las variables de entorno (`DB_HOST`, `DB_USER`, etc.) deteniendo el servidor si faltan.
- [x] **CORS permisivo** — Restringido al dominio del frontend (`process.env.FRONTEND_URL`).
- [x] **Sin validación de inputs** — Implementada validación exhaustiva con `express-validator` en todas las rutas transaccionales (auth, products, sales, clients, categories, users).
- [x] **Sin rate limiting** — Se implementó `express-rate-limit` para prevenir fuerza bruta en `/api/auth`.
- [x] **Token en localStorage** — Migrado a cookies HttpOnly (Preparación para entornos Cloud como AWS ALB o API Gateway que manejan sesiones seguras de forma transparente).

### Disponibilidad
- [x] **Sin health check** — Implementado `GET /health` para integraciones con Load Balancers y orquestadores (K8s, ECS).
- [x] **Sin SSL en BD** — Implementado soporte de conexión cifrada (TLS) vía variable `DB_SSL=true` (requerido en AWS RDS, Cloud SQL).
- [ ] **Sin clustering** — Un solo proceso Node.js; sin PM2, ECS tasks o pods de Kubernetes
- [x] **Sin reintentos de conexión** — Creada función `connectWithRetry()`. Si la BD se cae o reinicia, el backend espera y reintenta conectarse antes de iniciar peticiones HTTP.

### Almacenamiento
- [ ] **Imágenes en disco local** — `backend/uploads/` es incompatible con múltiples instancias. Migrar a S3 / GCS / Azure Blob + CDN

### Observabilidad
- [ ] **Solo console.log** — Sin logging estructurado (Winston, Pino); no integrable con CloudWatch, Stackdriver, etc.
- [ ] **Sin métricas** — Sin instrumentación para Prometheus/Grafana o herramientas cloud equivalentes

### Configuración
- [ ] **Sin secrets management** — No integra AWS Secrets Manager, Azure Key Vault ni GCP Secret Manager
- [ ] **Sin variables de entorno para producción** — Faltan variables críticas (ver `.env.example`)

---

## Esquema de base de datos

```text
roles ─────────── usuarios
                     │
categorias ─── productos
                     │
clientes ───── ventas ──── detalle_ventas ── productos
                 │
               usuarios
```

---

## Entregables de la evaluación (recordatorio)

- [ ] Diagrama de arquitectura cloud detallado
- [ ] Repositorio GitHub con todo el código de implementación
- [ ] URL funcional del sistema desplegado
- [ ] Bitácora de avances (Scrum board / Trello)
- [ ] Presentación: problemática → arquitectura propuesta → decisiones técnicas → demo

---

## Historial de Versiones (Changelog)

### v3 — Resiliencia de Base de Datos
*(Mejoras de disponibilidad y seguridad exigidas en la Nube)*

- **Disponibilidad**:
  - Implementación de **Reintentos de Conexión Automáticos** (`connectWithRetry`). El servidor ya no muere por cortes de red o reinicios de base de datos.
  - Sincronización de inicio de HTTP: La API no recibe peticiones hasta asegurar una conexión estable con la BD.
- **Seguridad y Cloud**:
  - **Eliminación de contraseñas por defecto**. Ahora el código es totalmente *stateless* y depende 100% del entorno (`.env` o Secrets Manager).
  - Habilitación de certificados **SSL dinámicos** (`DB_SSL`) para cifrar tráfico hacia Amazon RDS o Google Cloud SQL.

### v2 — Fase de Estabilización y Autenticación Segura
*(Avances realizados preparando la arquitectura Cloud)*

- **Seguridad Perimetral**:
  - Incorporación de **Helmet** como primera línea de defensa de cabeceras HTTP.
  - Implementación de **Rate Limiting** estricto en `/api/auth` para mitigar ataques de fuerza bruta.
  - Configuración estricta de **CORS** ligada a variables de entorno (`FRONTEND_URL`).
- **Autenticación Cloud-Native**:
  - Migración completa de almacenamiento de sesión. Eliminación de Tokens en `localStorage` (vulnerable a XSS).
  - Implementación de Cookies `HttpOnly`, `SameSite` y `Secure`.
  - Creación de nuevo Contexto Global de React (`AuthContext`) que maneja sesiones transparentes sincronizadas con el Backend.
- **Disponibilidad**:
  - Creación del endpoint **Health Check** (`GET /health`) para integraciones con orquestadores (Docker, K8s) y balanceadores de carga (AWS ALB).
