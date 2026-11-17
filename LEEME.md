# Sitio web — Muso Business

Sitio estático en HTML, CSS y JavaScript, bilingüe (español en la raíz, inglés en `/en/`).
No necesita base de datos ni servidor especial: se sube tal cual a cualquier hosting.

## Estructura

```
index.html  nosotros.html  productos.html  servicios.html  cobertura.html  contacto.html  404.html
en/         index.html  about.html  products.html  services.html  coverage.html  contact.html
assets/css/styles.css        estilos de todo el sitio
assets/js/main.js            menú, animaciones, formulario y CONFIGURACIÓN (WhatsApp y correo)
assets/js/cotizacion.js      lista de cotización (cajón lateral)
assets/js/catalogo.js        buscador y filtros del catálogo
data/productos.js            LISTA DE PRODUCTOS (editar aquí)
assets/img/  assets/fonts/   logo, íconos, imagen para redes y fuentes
sitemap.xml  robots.txt  .htaccess
```

## Tareas habituales

**Agregar o editar productos** — abrir `data/productos.js`. Las instrucciones están al inicio del
archivo. Los 29 productos actuales son de ejemplo y deben reemplazarse por el listado real.

**Cambiar WhatsApp o correo** — en `assets/js/main.js`, bloque `CONFIG`. El número y el correo
también aparecen escritos en el HTML (pie de página y contacto): buscar y reemplazar
`593992759073`, `+593 99 275 9073` y `ventas@musobusiness.com` en todos los archivos.

**Cambiar el dominio** — buscar y reemplazar `https://www.musobusiness.com/` en todos los `.html`,
`sitemap.xml` y `robots.txt`.

## Antes de publicar

1. Registrar el dominio y crear el correo; actualizar los datos de arriba si cambian.
2. Reemplazar los productos de ejemplo por los reales.
3. Confirmar con la empresa el número de formulario de la certificación FAA (8130-1 u 8130-3).
4. Subir todo el contenido de esta carpeta a la raíz del hosting (`public_html`).
5. Activar HTTPS y descomentar la redirección en `.htaccess`.
6. Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.
7. Crear el Perfil de Empresa en Google (Google Business Profile) para aparecer en Maps.

## Créditos de las fotografías

Fotos de [Unsplash](https://unsplash.com), de uso libre comercial bajo la
[Licencia de Unsplash](https://unsplash.com/license) (no exige atribución, pero se agradece).
Se recomienda reemplazarlas con el tiempo por fotos propias de la empresa.

| Archivo (assets/img/) | Autor |
|---|---|
| cat-fuselaje.webp | Cook aynne |
| cat-motores.webp | Kaspars Eglitis |
| cat-avionica.webp | Dan Lohmar |
| cat-consumibles.webp | Fulvio Ciccolo |
| cat-gse.webp | Francesco Patrinostro |
| cat-senaletica.webp | Praveen Thirumurugan |
| hero-nosotros.webp | Pandu Agus Wismoyo |
| hero-productos.webp | Angel Sinigersky |
| hero-servicios.webp | Will Haddock |
| hero-cobertura.webp | Matheus Frade |
| hero-contacto.webp | Andrés Dallimonti |
| foto-hangar.webp | Z Zhang |
| foto-gse.webp | Joao Vitor Marcilio |
| foto-neumatico.webp | Mario Verduzco |

Los archivos `*-sm.webp` son versiones livianas para celulares.
