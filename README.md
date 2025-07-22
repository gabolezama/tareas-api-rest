# 🚀 Aplicación de Gestión de Tareas (TornadoPy & React)

Este proyecto es una aplicación web simple para la gestión de tareas, construida con un backend en **Python (Tornado)** y una base de datos **PostgreSQL**, y un frontend en **React (TypeScript)**. Todo el entorno está orquestado con **Docker Compose** para facilitar el desarrollo y despliegue.

---

## 📖 Manual de Usuario Básico

Esta aplicación te proporciona una forma sencilla e intuitiva de gestionar tus tareas. A continuación, te explicamos cómo interactuar con ella:

### 1. Ver Tareas Existentes

Al iniciar la aplicación y cargar la página principal en tu navegador, verás inmediatamente una **lista de todas las tareas** que han sido guardadas.

* Cada tarea se presenta con su **título**, una **descripción** detallada y su **estado actual** (por ejemplo, "Pendiente" o "Completada").
* La lista se actualiza automáticamente al añadir, editar o eliminar tareas, reflejando siempre el estado más reciente de tus pendientes.

### 2. Crear una Nueva Tarea

Para añadir una nueva tarea a tu lista:

* Busca un **botón o formulario de entrada** en la interfaz (usualmente en la parte superior o inferior de la lista).
* Ingresa el **título** de tu tarea (por ejemplo, "Comprar víveres").
* Añade una **descripción** opcional para dar más detalles (por ejemplo, "Leche, huevos, pan y fruta").
* Una vez que hayas completado los campos necesarios, haz clic en el botón de **"Crear"** o **"Añadir"**. La nueva tarea aparecerá automáticamente en tu lista.

### 3. Editar una Tarea Existente

Si necesitas modificar los detalles de una tarea que ya existe:

* Localiza la tarea que deseas editar en la lista.
* Busca un **icono de "Editar"** (a menudo un lápiz) o un botón de **"Editar"** asociado a esa tarea.
* Al hacer clic, se te presentará un formulario prellenado con la información actual de la tarea.
* Modifica el **título**, la **descripción** o el **estado** según necesites.
* Haz clic en **"Guardar"** o **"Actualizar"** para aplicar los cambios. La tarea se actualizará en la lista.

### 4. Eliminar una Tarea

Cuando una tarea ya no es necesaria, puedes eliminarla fácilmente:

* Encuentra la tarea que quieres borrar en tu lista.
* Busca un **icono de "Eliminar"** (comúnmente un cubo de basura) o un botón de **"Eliminar"** junto a la tarea.
* Al hacer clic, es posible que se te pida una **confirmación** para evitar eliminaciones accidentales.
* Confirma la eliminación, y la tarea será **removida permanentemente** de tu lista.

Este manual te ayudará a empezar a usar la aplicación de tareas de inmediato. ¡Explora y organiza tus pendientes!

---

### 🏗️ Arquitectura del Sistema

La aplicación está construida siguiendo un enfoque de **servicios separados y contenedorizados** usando Docker Compose. Esto nos permite un desarrollo consistente y un futuro despliegue más manejable.

#### Componentes Principales

1.  **Frontend (React/TypeScript):**
    * **Propósito:** Es la interfaz de usuario con la que los usuarios interactúan directamente en su navegador. Se encarga de mostrar la información y capturar las acciones del usuario.
    * **¿Por qué?:** React ofrece un desarrollo de UI eficiente y componentes reutilizables, mientras que TypeScript añade tipado estático, lo que reduce errores y mejora la mantenibilidad del código.

2.  **Backend (Tornado/Python):**
    * **Propósito:** Actúa como el cerebro de la aplicación, manejando la lógica de negocio, procesando las solicitudes del frontend, interactuando con la base de datos y sirviendo la API.
    * **¿Por qué?:** Tornado es un framework web asíncrono en Python, ideal para construir APIs rápidas y escalables que manejan muchas conexiones concurrentes, lo cual es eficiente para una API REST.

3.  **Base de Datos (PostgreSQL):**
    * **Propósito:** Almacena de forma persistente todos los datos de las tareas.
    * **¿Por qué?:** PostgreSQL es una base de datos relacional robusta, confiable y de código abierto, muy adecuada para la mayoría de las aplicaciones web.

#### Estructura de Carpetas

Ambos el frontend y el backend están organizados para promover la **modularidad**, la **separación de preocupaciones** y la **testabilidad**.

##### **Frontend (`frontend/`)**

* **`src/components/`**: Contiene componentes React genéricos y reutilizables (botones, modales). *Razón: Maximiza la reutilización y consistencia visual.*
* **`src/features/`**: Agrupa toda la lógica (componentes, estado Redux, etc.) de una funcionalidad específica, como las tareas. *Razón: Facilita el mantenimiento y el escalado de características.*
* **`src/redux/`**: Maneja el estado global de la aplicación con Redux Toolkit, incluyendo *slices* para cada parte del estado. *Razón: Centraliza la gestión del estado y simplifica las interacciones complejas.*
* **`public/`**: Archivos estáticos que se sirven directamente (HTML base, favicon). *Razón: Contiene los activos públicos y el punto de entrada HTML de la aplicación.*

##### **Backend (`backend/app/`)**

El backend sigue un patrón similar a la **Arquitectura Limpia (Clean Architecture)**:

* **`presentation/`**: Contiene los `handlers` de Tornado (nuestros *endpoints* API) y los `DTOs` (objetos para validar y estructurar datos de entrada/salida). *Razón: Es la capa más externa, responsable de recibir las peticiones HTTP y traducirlas a la lógica de negocio.*
* **`application/`**: Guarda los "casos de uso" (use cases), que son la lógica de negocio pura de la aplicación (ej. crear tarea, obtener tarea). *Razón: Aísla las reglas de negocio, haciéndolas independientes de la base de datos o del framework web y, por lo tanto, altamente testables.*
* **`domain/`**: Define las entidades centrales (ej. `Task`) y las reglas de negocio más fundamentales. *Razón: Es el "corazón" de la aplicación, conteniendo objetos que representan el negocio sin dependencias externas.*
* **`adapters/`**: Implementa cómo la aplicación interactúa con servicios externos, como la base de datos (repositorios SQLAlchemy). *Razón: Proporciona una interfaz para que la lógica de negocio se comunique con el mundo exterior sin saber los detalles de implementación.*
* **`infrastructure/`**: Contiene configuraciones para la base de datos (ej. SQLAlchemy). *Razón: Se encarga de los detalles técnicos de cómo la aplicación se conecta a sus recursos.*
* **`main.py`**: El punto de entrada que inicializa la aplicación Tornado y define las rutas principales. *Razón: Es el orquestador que "ensambla" todas las capas y lanza el servidor.*

---

**Componentes:**

* **Frontend (React/TypeScript):**
    * Interfaz de usuario que se ejecuta en el navegador del cliente.
    * Desarrollado con React y TypeScript para una experiencia robusta y tipada.
    * Se comunica con el backend a través de peticiones HTTP (API RESTful).
    * Contenedorizado para un despliegue y desarrollo sencillo.
* **Backend (Tornado/Python):**
    * Servidor API que maneja la lógica de negocio y la interacción con la base de datos.
    * Construido con el framework web asíncrono Tornado en Python.
    * Implementa los *endpoints* para la gestión de tareas (CRUD).
    * Contenedorizado.
* **Base de Datos (PostgreSQL):**
    * Sistema de gestión de bases de datos relacionales utilizado para almacenar la información de las tareas.
    * Se ejecuta en su propio contenedor Docker para aislamiento y fácil gestión.

**Flujo de Comunicación:**

1.  El **cliente** (tu navegador) accede al **Frontend** a través de `http://localhost:3000`.
2.  El **Frontend** realiza llamadas a la API del **Backend** (ej. a `http://backend:8888/tasks` dentro de la red Docker).
3.  El **Backend** procesa la solicitud, interactúa con la base de datos **PostgreSQL** para leer/escribir datos y devuelve la respuesta al Frontend.
4.  El **Frontend** actualiza la interfaz de usuario basándose en la respuesta del Backend.

---

## ⚙️ Instrucciones Detalladas para Instalación y Puesta en Marcha

Para levantar y ejecutar esta aplicación, necesitarás tener **Docker** y **Docker Compose** instalados en tu sistema.

### Prerrequisitos

* **Docker Desktop:** Instala Docker Desktop desde el [sitio oficial de Docker](https://www.docker.com/products/docker-desktop/). Esto incluye Docker Engine y Docker Compose.

### 1. Clonar el Repositorio

Primero, clona el repositorio del proyecto a tu máquina local:

```bash
git clone https://github.com/gabolezama/tareas-api-rest.git
```

### 2. Levantar la Aplicación con Docker Compose

Desde la raíz de tu proyecto, ejecuta el siguiente comando para **construir las imágenes de Docker y levantar todos los servicios**:

```bash
docker-compose up --build -d
```

### 3. Detener la Aplicación

Cuando hayas terminado de usar la aplicación, puedes **detener y eliminar los contenedores** y sus redes.

Desde la raíz de tu proyecto, ejecuta:

```bash
docker-compose down ## o docker-compose down --volumes
```

---

### 🌐 Configuración para Entornos de Desarrollo Local y Despliegue (Deployment)

Es importante entender por qué usamos `localhost` en el desarrollo y cómo esto debe cambiar cuando prepares la aplicación para un entorno de producción (despliegue).

#### ¿Por qué `localhost` en Desarrollo?

Durante el desarrollo local, usamos `localhost` (y puertos como `3000` para el frontend y `8888` para el backend) por varias razones:

1.  **Conveniencia:** Es la forma más fácil y rápida de acceder a los servicios que corren en tu propia máquina.
2.  **Aislamiento:** Permite que cada servicio (frontend, backend, base de datos) opere en su propio puerto sin conflictos directos con otras aplicaciones de tu sistema.
3.  **Docker Compose:** Dentro de la red de Docker Compose, los servicios se comunican entre sí usando sus **nombres de servicio** definidos en `docker-compose.yml` (ej. el frontend se conecta al backend usando `http://backend:8888`). Sin embargo, para que tu navegador (que está fuera de la red Docker) pueda acceder al frontend o al backend, Docker **mapea estos puertos internos a `localhost`** en tu máquina.
4.  **CORS:** La configuración de CORS (`Access-Control-Allow-Origin: http://localhost:3000`) es específica para permitir que el navegador acceda desde ese origen durante el desarrollo.

#### Cambios Necesarios para el Despliegue (Producción)

Cuando muevas la aplicación a un entorno de producción (por ejemplo, un servidor en la nube), `localhost` ya no será el dominio relevante. Deberás considerar los siguientes cambios:

1.  **Dominios/IPs Reales:**
    * El frontend se servirá desde un **dominio público** (ej. `https://todoreact.com`).
    * El backend tendrá su propio **dominio o una IP pública** (ej. `https://api.todoreact.com`).
    * Actualiza la **`API_BASE_URL`** en tu configuración de frontend para que apunte al dominio o IP real de tu backend en producción.

2.  **Configuración de CORS:**
    * En el backend (en `backend/app/presentation/handlers.py`), la cabecera `Access-Control-Allow-Origin` debe cambiar de `http://localhost:3000` al **dominio real de tu frontend en producción** (ej. `https://todoreact.com`). Si tu frontend y backend están en el mismo dominio base pero subdominios diferentes (ej. `app.todoreact.com` y `api.todoreact.com`), es posible que debas ajustar esto.
    * Para mayor seguridad, nunca uses `*` (permitir todos los orígenes) en producción a menos que sea una API completamente pública sin datos sensibles.

3.  **Variables de Entorno para la Base de Datos:**
    * Las credenciales de la base de datos (usuario, contraseña, nombre de la DB) y el host (`DB_HOST`, `DB_PORT`) en tu archivo `.env` o en la configuración de tu entorno de despliegue deben apuntar a la **base de datos real de producción**, que probablemente será un servicio gestionado (como AWS RDS, Google Cloud SQL, etc.) o un servidor de base de datos dedicado.
    * Estas variables suelen gestionarse con **variables de entorno del sistema** en el servidor de producción, no con un archivo `.env` directo en el repositorio.

4.  **Servidor Web para el Frontend (Nginx/Apache):**
    * En producción, el frontend estático de React (los archivos HTML, CSS, JS compilados) no se sirve directamente con el servidor de desarrollo de React. Generalmente, se utiliza un **servidor web robusto** como Nginx o Apache para servir estos archivos de forma eficiente y segura.
    * Esto implicaría un `Dockerfile` y una configuración de Docker Compose ligeramente diferentes para el frontend, que compilarían la aplicación React y luego la servirían con Nginx.

5.  **Seguridad y Escalamiento:**
    * Implementa **HTTPS** para todas las comunicaciones. Esto generalmente se maneja con un *reverse proxy* (como Nginx o un balanceador de carga) y certificados SSL/TLS.
    * Considera estrategias de **escalamiento** para el backend y la base de datos si esperas mucho tráfico (ej. Kubernetes, Docker Swarm, servicios *serverless*).
    * Gestiona secretos y claves de forma segura, lejos del control de versiones.

---