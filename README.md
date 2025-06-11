# Frontend del Marketplace

Este repositorio contiene la interfaz de usuario (UI) del Marketplace, desarrollada con Next.js y React.js/TypeScript. Proporciona la experiencia de usuario para compradores, vendedores y administradores, consumiendo la API del backend.

## Tecnologías Utilizadas

* **Next.js:** Framework de React para el desarrollo de aplicaciones web full-stack, con renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG).
* **React.js:** Biblioteca JavaScript para construir interfaces de usuario.
* **TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript, mejorando la robustez y el mantenimiento del código.
* **Tailwind CSS:** Framework CSS utility-first para construir diseños personalizados y responsivos rápidamente.
* **Redux Toolkit:** Para la gestión centralizada y predecible del estado de la aplicación.
* **Firebase SDK (cliente):** Para la integración con la base de datos de Firebase.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu sistema:

* [Node.js](https://nodejs.org/en/) (versión LTS recomendada, ej. 18.x o 20.x)
* [npm](https://www.npmjs.com/) (viene con Node.js) o [Yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)

## Configuración del Entorno

Sigue estos pasos para configurar y ejecutar el frontend localmente:

1.  **Clonar el Repositorio:**
    Si aún no lo has hecho, clona el repositorio principal y navega al directorio del frontend:
    ```bash
    git clone https://github.com/juanco2597/Tech-marketplace-frontend.git 
    cd tech-markeplace-frontend // si se usa en un monorepo
    # O si es un repositorio solo para frontend:
    # git clone https://github.com/juanco2597/Tech-marketplace-frontend.git 
    # cd frontend
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    # o si usas yarn
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo llamado `.env.local` en la raíz de este directorio (`/frontend`) y añade las siguientes variables con tus credenciales y la URL de tu backend:

    ```env
    # URL del Backend API
    NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api # Ajusta si tu backend se ejecuta en un puerto diferente

    # Firebase Configuration (estas credenciales se usan con el SDK del cliente Firebase)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id # Opcional, si usas Google Analytics
    ```

4.  **Ejecutar la Aplicación:**
    Asegúrate de que tu backend esté en ejecución (consulta el `README.md` del backend). Luego, en el directorio del frontend:
    ```bash
    npm run dev
    # o si usas yarn
    yarn dev
    ```
    El frontend se ejecutará en `http://localhost:3000` (o el puerto que Next.js asigne por defecto si el 3000 está ocupado).

## Estructura de Directorios