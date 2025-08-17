# Papa Sureña

Sitio estático minimalista (HTML, CSS, JS) para venta mayorista de papas por saco.

## Estructura
- `index.html`: landing con secciones y SEO.
- `styles.css`: estilos responsive.
- `script.js`: envío a WhatsApp y mejoras UX.
- `favicon.svg`: icono.
- `robots.txt`, `sitemap.xml`.

## Despliegue en GitHub Pages (Project Site)
1. Crea repo `papasurena` y sube estos archivos en la raíz del repo.
2. En Settings → Pages → Source: Branch `main` y carpeta `/root`.
3. La URL será: `https://<tu-usuario>.github.io/papasurena/`.

### Enviar formulario a WhatsApp
El formulario abre WhatsApp a `+51 918 647 921` con el mensaje prellenado.

### Dominio personalizado (opcional)
Si tienes un dominio (ej: papasurena.cl), en `Settings → Pages → Custom domain`:
- Apunta un CNAME a `<tu-usuario>.github.io`.
- Agrega un archivo `CNAME` en la raíz con el dominio.

## Edición de contenido
- Edita textos en `index.html` (secciones H1-H3, FAQs, beneficios).
- Agrega más imágenes si deseas, optimizadas y con `alt` descriptivo.
