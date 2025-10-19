DOCUMENTACIÓN DE LA ACADEMIA DEL AMIGO:

Este documento es para consultar la lógica de implementación del frontend y la arquitectura del backend del proyecto .



LÓGICA DEL FRONTEND:

La página está construida como una "Single Page Application" (SPA) estática, donde el usuario navega verticalmente 
a través de distintas secciones identificadas por IDs (#about, #courses, etc.).

- **Estructura Semántica:** Se utilizan etiquetas de HTML5 como `<nav>`, `<main>`, `<section>` y `<footer>` 
    para dar un significado claro a cada parte del documento, mejorando la accesibilidad y el SEO.

- **Interactividad:** La navegación se mejora con Bootstrap Scrollspy, que detecta la posición del scroll del usuario y 
    actualiza la clase `.active` en los enlaces del menú (`.nav-link`), proporcionando feedback visual inmediato.

- **Optimización:** El script de JavaScript de Bootstrap se carga con el atributo `defer` para no bloquear el renderizado del HTML, 
    mejorando la percepción de velocidad de carga de la página (First Contentful Paint).



LÓGICA DE BOOTSTRAP (FRAMEWORK CSS)

Bootstrap 5 se utiliza como una metodología de desarrollo de interfaces, no tanto como una librería o CSS convencional.

- **Grid System (Sistema de Rejilla):** Es la base de la responsividad. La estructura `.container` > `.row` > `.col-*` 
    permite que el contenido se organice automáticamente en columnas que se apilan en pantallas pequeñas. 
    Por ejemplo, la sección de cursos usa `.col-md-4` para mostrar 3 tarjetas por fila en pantallas medianas o más grandes, 
    y una sola tarjeta por fila en móviles.

- **Componentes Reutilizables:** En lugar de crear componentes desde cero, se aprovechan los de Bootstrap:
  - **Navbar:** Proporciona una barra de navegación responsiva (`.navbar-expand-lg`) que se colapsa en un menú "hamburguesa" en móviles.
  - **Card:** Es la base para mostrar cada curso. Clases como `.card-title` o `.card-text` aseguran una estructura consistente.
  - **Formularios:** Las clases `.form-control` y `.form-label` estilizan los campos de entrada de manera limpia y consistente.

- **Clases de Utilidad (Utility Classes):** Se utilizan extensivamente para aplicar estilos rápidos sin escribir CSS. 
    Ejemplos: `py-5` (padding vertical), `fw-bold` (fuente en negrita), `ms-auto` (margen automático a la izquierda), 
    `text-center`, etc. Esto acelera el desarrollo enormemente.

- **Personalización Avanzada:** El archivo `style.css` personaliza la apariencia del sitio mediante la sobreescritura de las variables 
    CSS de Bootstrap (`:root`). Esto permite cambiar colores y fuentes de forma global, asegurando que todos los componentes 
    (incluso los futuros) sigan la misma guía de estilo.



FUTURA IMPLEMENTACIÓN (BACKEND CON EXPRESS Y MONGOOSE):

La siguiente fase del proyecto convertirá esta página estática en una aplicación web dinámica.

- **Servidor Express.js:** Se creará un servidor en Node.js que manejará las rutas de la aplicación:

  - **GET `/`:** Renderizará la página de inicio, pero en lugar de ser HTML estático, 
    los cursos se obtendrán de la base de datos y se pasarán a una plantilla EJS.

  - **POST `/contact`:** La ruta del formulario de contacto recibirá los datos del usuario 
    (usando `express.urlencoded`), los validará y los guardará en la base de datos.
    
- **Base de Datos con Mongoose:** Se utilizará Mongoose como ODM (Object Data Modeling) para interactuar con una base de datos MongoDB.
  - **Modelos:** Se definirán esquemas (Schemas) para las colecciones, como `Course` 
    (con propiedades como `title`, `description`, `imageUrl`) y `Message` (para los mensajes de contacto).

  - **CRUD:** El servidor implementará operaciones CRUD (Create, Read, Update, Delete) para que, en el futuro, 
    se pueda crear un panel de administrador para añadir, editar o eliminar cursos sin tocar el código.
