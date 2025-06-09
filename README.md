# Task Manager Pro

## Enunciado

La empresa TechNova Solutions, dedicada al desarrollo de soluciones web modernas para equipos de trabajo colaborativo, está creando un nuevo producto llamado "TaskManager Pro". Esta herramienta busca facilitar la administración de tareas dentro de equipos remotos y mejorar la productividad mediante una interfaz amigable y accesible desde cualquier navegador.

## Requerimientos Tecnicos del programa

1.	Mostrar una lista de tareas con atributos: título, descripción, estado y prioridad.
2.	Permitir agregar nuevas tareas mediante un formulario.
3.	Permitir editar una tarea existente.
4.	Permitir eliminar tareas.
5.	Marcar tareas como completadas o pendientes.
6.	Registrar la fecha de creación y la fecha de vencimiento de cada tarea.
7.	Calcular y mostrar automáticamente el tiempo restante hasta la fecha de vencimiento.
8.	Generar un informe visual con el porcentaje de tareas completadas versus pendientes. exportalo
9.	Filtrar tareas por estado (completada, pendiente, vencida) y por prioridad.
10.	Buscar tareas por palabra clave (title, description).
11.	Mostrar alertas o notificaciones visuales para tareas próximas a vencer.
12.	Incluir validación de formularios (campos requeridos, fechas válidas, mínimo de caracteres).
13.	Aplicar diseño responsive y limpio, compatible con escritorio y móvil.
14.	Crear componentes reutilizables (por ejemplo, task-item, task-filter, etc.).
15.	Las tareas deben ser obtenida desde una API Rest conectada a una Base de Datos

## Dependencias para correr el programa

- Node.js (version mas moderna)
- Angular (version mas moderna)
- Docker

## Como ejecutar el programa localmente

1.  Instalar proyecto desde github
2.  Instalar Node.js
3.  Abrir carpeta de frontend
4.  Abrir consola del sistema en carpeta
5.  Ejecutar "npm install --force"
6.  Ejecutar "npm install -g @angular/cli"
7.  Ejecutar "ng serve"

## Como ejecutar el programa via dockerfile

1. Instalar Docker desktop
2. Instalar Node.js
3. Abrir consola o IDE de eleccion}
4. Crear un archivo .Dockerfile y colocar codigo de dockerfile adjunto en GitHub
5. Crear imagen de docker usando "docker build --no-cache -t ***nombre*** ." // Asegurate de estar en la carpeta del dockerfile
6. Ejecutar el dockerfile usando "docker run -p 4200:4200 ***nombre***" // el proyecto se abrira en el puerto 9000 de tu equipo
