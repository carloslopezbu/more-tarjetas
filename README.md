# More Tarjetas 🎉

Este proyecto es una aplicación web desarrollada con **React** y **Vite** para gestionar tareas, fotos y listas personalizadas. Fue creado como parte de un proyecto especial para celebrar un aniversario.

## Características

- **Gestión de Tareas**: Crear, actualizar y eliminar tareas con estados como "Por Completar", "En Progreso" y "Finalizada".
- **Carrusel de Fotos**: Visualización de fotos almacenadas en álbumes, con soporte para caché local.
- **Integración con Supabase**: Almacenamiento y sincronización de datos en tiempo real.
- **Filtros Personalizados**: Filtrar tareas y fotos según criterios específicos.
- **Diseño Responsivo**: Interfaz optimizada para dispositivos móviles y de escritorio.

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de desarrollo rápida y ligera.
- **Supabase**: Backend como servicio para autenticación y base de datos.
- **TailwindCSS**: Framework de estilos para un diseño moderno y personalizable.
- **Framer Motion**: Animaciones fluidas y atractivas.
- **Embla Carousel**: Carrusel ligero y personalizable.

## Configuración del Proyecto

### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **pnpm** (gestor de paquetes)

### Instalación

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd more-tarjetas
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno en un archivo `.env`:
   ```env
   VITE_SUPABASE_URL=<tu_supabase_url>
   VITE_SUPABASE_ANON=<tu_supabase_anon_key>
   VITE_FOLDER_ID=<tu_folder_id>
   VITE_GOOGLE_DRIVE=<tu_google_drive_api_key>
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

5. Abre la aplicación en tu navegador en [http://localhost:5173](http://localhost:5173).

## Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Genera una versión optimizada para producción.
- `pnpm preview`: Previsualiza la versión de producción.

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── api/              # Funciones para interactuar con APIs externas
├── hooks/            # Hooks personalizados
├── styles/           # Archivos de estilos
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada
```

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).
