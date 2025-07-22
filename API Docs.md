# Documentación de la API de Gestión de Tareas

Esta documentación describe cómo interactuar con la API RESTful de Gestión de Tareas. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las tareas.

---

## Base URL

La URL base para todas las peticiones a la API es:
`http://localhost:8888` (cuando se ejecuta localmente con Docker Compose)

---

## Modelos de Datos

### Tarea (`Task`)

Representa una tarea individual en el sistema.

| Campo       | Tipo      | Descripción                                | Requerido | Ejemplo               |
| :---------- | :-------- | :----------------------------------------- | :-------- | :-------------------- |
| `id`        | `Integer` | Identificador único de la tarea.           | No        | `1`                   |
| `title`     | `String`  | Título corto de la tarea.                  | Sí        | `"Comprar víveres"`   |
| `description` | `String`  | Descripción detallada de la tarea.         | No        | `"Leche, pan, huevos"`|
| `completed` | `Boolean` | Indica si la tarea ha sido completada.    | No        | `true`                |
| `priority`  | `String`  | Nivel de prioridad de la tarea.             | No        | `"Alta"`              |

**Valores posibles para `priority`:** `"Baja"`, `"Media"`, `"Alta"` (por defecto: `"Media"`)

---

## Endpoints

### 1. **Listar todas las Tareas / Crear Nueva Tarea**

* **Endpoint:** `/tasks`
* **Métodos:** `GET`, `POST`
* **Tags:** `Tareas`

#### `GET /tasks`

* **Descripción:** Recupera una lista de todas las tareas existentes.
* **Parámetros:** Ninguno
* **Ejemplo de Respuesta (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Estudiar para el examen",
        "description": "Repasar los temas de cálculo.",
        "completed": false,
        "priority": "Alta"
      },
      {
        "id": 2,
        "title": "Llamar al cliente",
        "description": "Confirmar reunión para el jueves.",
        "completed": true,
        "priority": "Media"
      }
    ]
    ```

#### `POST /tasks`

* **Descripción:** Crea una nueva tarea en el sistema.
* **Body de la Petición (JSON):**
    ```json
    {
      "title": "Preparar presentación",
      "description": "Diapositivas para la reunión del viernes.",
      "completed": false,
      "priority": "Alta"
    }
    ```
    * `title` es obligatorio.
    * `description`, `completed` y `priority` son opcionales.
* **Ejemplo de Respuesta (201 Created):**
    ```json
    {
      "id": 3,
      "title": "Preparar presentación",
      "description": "Diapositivas para la reunión del viernes.",
      "completed": false,
      "priority": "Alta"
    }
    ```
* **Posibles Códigos de Respuesta:**
    * `201 Created`: Tarea creada exitosamente.
    * `400 Bad Request`: Datos de entrada inválidos (ej. `title` faltante).

---

### 2. **Obtener / Actualizar / Eliminar una Tarea Específica**

* **Endpoint:** `/tasks/{id}`
* **Métodos:** `GET`, `PUT`, `DELETE`
* **Tags:** `Tareas`

#### `GET /tasks/{id}`

* **Descripción:** Obtiene los detalles de una tarea específica por su ID.
* **Parámetros de Ruta:**
    * `id` (Integer): El identificador único de la tarea.
* **Ejemplo de Petición:**
    `GET http://localhost:5000/tasks/1`
* **Ejemplo de Respuesta (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Estudiar para el examen",
      "description": "Repasar los temas de cálculo.",
      "completed": false,
      "priority": "Alta"
    }
    ```
* **Posibles Códigos de Respuesta:**
    * `200 OK`: Tarea encontrada.
    * `404 Not Found`: La tarea con el ID especificado no existe.

#### `PUT /tasks/{id}`

* **Descripción:** Actualiza los detalles de una tarea existente.
* **Parámetros de Ruta:**
    * `id` (Integer): El identificador único de la tarea a actualizar.
* **Body de la Petición (JSON):**
    Se pueden enviar uno o más campos de la tarea. Los campos no incluidos conservarán su valor actual.
    ```json
    {
      "title": "Estudiar Cálculo Avanzado",
      "completed": true,
      "priority": "Media"
    }
    ```
* **Ejemplo de Respuesta (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Estudiar Cálculo Avanzado",
      "description": "Repasar los temas de cálculo.",
      "completed": true,
      "priority": "Media"
    }
    ```
* **Posibles Códigos de Respuesta:**
    * `200 OK`: Tarea actualizada exitosamente.
    * `400 Bad Request`: Datos de entrada inválidos.
    * `404 Not Found`: La tarea con el ID especificado no existe.

#### `DELETE /tasks/{id}`

* **Descripción:** Elimina una tarea específica del sistema.
* **Parámetros de Ruta:**
    * `id` (Integer): El identificador único de la tarea a eliminar.
* **Ejemplo de Petición:**
    `DELETE http://localhost:5000/tasks/1`
* **Ejemplo de Respuesta (204 No Content):**
    No hay contenido en el cuerpo de la respuesta.
* **Posibles Códigos de Respuesta:**
    * `204 No Content`: Tarea eliminada exitosamente.
    * `404 Not Found`: La tarea con el ID especificado no existe.

---

## Cómo Ejecutar la API Localmente (Docker Compose)

Para ejecutar la API junto con el frontend y la base de datos, utiliza Docker Compose.

1.  Asegúrate de tener Docker Desktop (o Docker Engine y Docker Compose CLI) instalado.
2.  Navega a la raíz de tu proyecto (donde se encuentra el archivo `docker-compose.yml`).
3.  Ejecuta el siguiente comando para construir y levantar los servicios:
    ```bash
    docker-compose up --build -d
    ```
4.  La API estará disponible en `http://localhost:5000`.
5.  Para detener y eliminar los servicios:
    ```bash
    docker-compose down
    ```

---