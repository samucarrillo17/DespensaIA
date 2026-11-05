# 🚀 NestJS Backend Blueprint / Starter Template

Un cascarón (*boilerplate*) robusto y de alto rendimiento basado en **NestJS**, diseñado para agilizar el desarrollo de nuevas aplicaciones y microservicios backend. Este template incluye configuraciones predefinidas de **autenticación JWT**, **control de acceso basado en roles (RBAC)**, **caché centralizada con Redis**, **TypeORM**, **validación de entorno con Joi**, **limitación de peticiones (Throttler)**, **filtros de excepciones globales** y **Docker Compose**.

---

## 📋 Tabla de Contenidos

- [🚀 NestJS Backend Blueprint / Starter Template](#-nestjs-backend-blueprint--starter-template)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [⚡ Tecnologías y Herramientas](#-tecnologías-y-herramientas)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
  - [🛠️ Características Principales](#️-características-principales)
    - [1. Módulo de Caché (Redis)](#1-módulo-de-caché-redis)
    - [2. Base de Datos y ORM (TypeORM + PostgreSQL)](#2-base-de-datos-y-orm-typeorm--postgresql)
    - [3. Variables de Entorno y Validación (Joi)](#3-variables-de-entorno-y-validación-joi)
    - [4. Limitador de Peticiones (Rate Limiting / Throttler)](#4-limitador-de-peticiones-rate-limiting--throttler)
    - [5. Módulo Common (Helpers y Filtros de Excepciones)](#5-módulo-common-helpers-y-filtros-de-excepciones)
    - [6. Autenticación y Autorización (JWT + RBAC + Decoradores)](#6-autenticación-y-autorización-jwt--rbac--decoradores)
    - [7. Validación de DTOs (`class-validator` y `class-transformer`)](#7-validación-de-dtos-class-validator-y-class-transformer)
    - [8. Entorno de Desarrollo en Docker (`docker-compose.yml`)](#8-entorno-de-desarrollo-en-docker-docker-composeyml)
  - [🚀 Guía de Inicio Rápido](#-guía-de-inicio-rápido)
    - [Paso 1: Clonar el repositorio](#paso-1-clonar-el-repositorio)
    - [Paso 2: Instalar dependencias](#paso-2-instalar-dependencias)
    - [Paso 3: Configurar variables de entorno](#paso-3-configurar-variables-de-entorno)
    - [Paso 4: Iniciar servicios con Docker](#paso-4-iniciar-servicios-con-docker)
    - [Paso 5: Ejecutar la aplicación en desarrollo](#paso-5-ejecutar-la-aplicación-en-desarrollo)
  - [📄 Licencia](#-licencia)

---

## ⚡ Tecnologías y Herramientas

* **Framework:** [NestJS](https://nestjs.com/)
* **Lenguaje:** TypeScript
* **ORM:** [TypeORM](https://typeorm.io/)
* **Base de Datos:** PostgreSQL
* **Caché & In-Memory Storage:** Redis (`ioredis` / `@keyv/redis` / `cache-manager-ioredis`)
* **Autenticación:** Passport, Passport-JWT, `@nestjs/jwt`
* **Validación de Datos:** `class-validator`, `class-transformer`, `Joi`
* **Seguridad y Rate Limit:** `@nestjs/throttler`
* **Contenedores:** Docker & Docker Compose

---

## 📁 Estructura del Proyecto

```text
src/
├── auth/                       # Módulo de Autenticación y Autorización
│   ├── decorators/             # Decoradores personalizados
│   │   ├── auth.decorator.ts   # Decorador compuesto @Auth(...roles)
│   │   ├── get-user.decorator.ts # Obtiene el usuario de la Request
│   │   ├── raw-headers.decorator.ts
│   │   └── role-protected.decorator.ts # Define metadatos de roles
│   ├── dto/                    # Data Transfer Objects (Login, Register, etc.)
│   ├── guards/                 # UserRoleGuard para protección RBAC
│   ├── interfaces/             # Contratos e interfaces del JWT Payload
│   ├── strategies/             # JwtStrategy de Passport
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── common/                     # Módulo reutilizable de utilidades globales
│   ├── dto/                    # DTOs comunes (ej. PaginationDto)
│   ├── helpers/
│   │   └── handle-db-exception.ts # Captura y formatea errores de base de datos
│   ├── filters/
│   │   └── all-exceptions.filter.ts # Filtro global de excepciones no controladas
│   └── common.module.ts
├── config/                     # Configuraciones y esquemas de validación (Joi)
│   └── joi.validation.ts
├── main.ts                     # Punto de entrada de la aplicación
└── app.module.ts               # Módulo principal
```

---

## 🛠️ Características Principales

### 1. Módulo de Caché (Redis)
Configurado de forma global mediante `CacheModule` e `ioredis` para la gestión ágil de almacenamiento en memoria. Permite almacenar respuestas de endpoints o guardar sesiones temporales para optimizar el rendimiento.

```typescript
// Ejemplo de uso dentro de un servicio
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getProducts() {
    const cachedData = await this.cacheManager.get('all_products');
    if (cachedData) return cachedData;

    const products = await this.fetchFromDatabase();
    await this.cacheManager.set('all_products', products, 60000); // TTL 60s
    return products;
  }
}
```

---

### 2. Base de Datos y ORM (TypeORM + PostgreSQL)
Integración completa con **TypeORM** para el manejo asíncrono de entidades, migraciones y repositorios. Soporta autoconexión parametrizada desde el archivo `.env`.

---

### 3. Variables de Entorno y Validación (Joi)
Evita que la aplicación inicie si falta alguna variable crítica en el entorno mediante un esquema formal con **Joi**.

#### Variables de Entorno Recomendadas (`.env.template`):
```env
# SERVER CONFIG
PORT=3000
HOST_API=http://localhost:3000/api

# DATABASE CONFIG
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=backend_db

# REDIS CONFIG
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT CONFIG
JWT_SECRET=super_secret_jwt_key_change_me
JWT_EXPIRES_IN=2h
```

---

### 4. Limitador de Peticiones (Rate Limiting / Throttler)
Configurado a nivel global con `@nestjs/throttler` para mitigar ataques de fuerza bruta o saturación de peticiones (*DDoS* de bajo nivel).

* **Límite predeterminado:** 100 peticiones por cada ventana de 120 segundos (2 minutos).

---

### 5. Módulo Common (Helpers y Filtros de Excepciones)

#### A. Global Exception Filter (`AllExceptionsFilter`)
* Intercepta automáticamente cualquier excepción o error no controlado dentro del ciclo de vida de la aplicación.
* Utiliza el `Logger` nativo de NestJS en lugar de `console.log` para escribir logs seguros, legibles y listos para integrarse con servicios de monitoreo (Kibana, Datadog, CloudWatch).
* Oculta detalles sensibles del servidor ante el cliente final.

#### B. Helper de Errores DB (`handleDBException`)
* Función centralizada para traducir códigos de error nativos de PostgreSQL / TypeORM (como duplicidad de llaves únicas `23505`) en respuestas HTTP legibles para el usuario final (ej. `400 Bad Request: Entity already exists`).

```typescript
// Ejemplo de uso en un repositorio / servicio
try {
  return await this.userRepository.save(newUser);
} catch (error) {
  handleDBExceptions(error, this.logger);
}
```

---

### 6. Autenticación y Autorización (JWT + RBAC + Decoradores)

Flujo de autenticación completo y listo para usar:

* **Estrategia JWT (`JwtStrategy`):** Valida la firma del token enviado en las cabeceras `Authorization: Bearer <token>` y extrae el usuario de la base de datos.
* **Role Guard (`UserRoleGuard`):** Verifica que el usuario autenticado tenga los roles requeridos para consumir una ruta especificada.
* **Decorador Comprimido `@Auth(...roles)`:** Combina en un solo decorador legible el uso de `UseGuards(AuthGuard(), UserRoleGuard)` y los metadatos de roles.

#### Ejemplos de uso en Controllers:

```typescript
// 1. Proteger ruta requiriendo rol de ADMIN o SUPERUSER
@Get('admin-dashboard')
@Auth(ValidRoles.admin, ValidRoles.superUser)
getAdminData(@GetUser() user: User) {
  return { message: 'Bienvenido al panel', user };
}

// 2. Obtener datos del usuario autenticado sin requerir rol específico
@Get('profile')
@Auth()
getProfile(@GetUser() user: User, @GetUser('email') email: string) {
  return { user, email };
}
```

---

### 7. Validación de DTOs (`class-validator` y `class-transformer`)
El punto de entrada (`main.ts`) incluye la configuración global de `ValidationPipe`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

---

### 8. Entorno de Desarrollo en Docker (`docker-compose.yml`)

El proyecto incluye un archivo `docker-compose.yml` preconfigurado para levantar la base de datos **PostgreSQL** y la instancia de **Redis** en un solo comando:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para utilizar este cascarón en un nuevo proyecto:

### Paso 1: Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO> mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Copia el archivo de plantilla `.env.template` a `.env` y ajusta las credenciales si es necesario:
```bash
cp .env.template .env
```

### Paso 4: Iniciar servicios con Docker
Inicia los contenedores de PostgreSQL y Redis:
```bash
docker-compose up -d
```

### Paso 5: Ejecutar la aplicación en desarrollo
```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000/api`

---

## 📄 Licencia

Este proyecto es software libre bajo la licencia [MIT](LICENSE). Se puede clonar y utilizar libremente para cualquier proyecto personal o comercial.