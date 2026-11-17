# Portafolio de Laura Beltrán

Página web del portafolio de Laura Beltrán (diseño gráfico, ilustración y comunicación).

## Cómo funciona

- `src/plantilla.html`: el diseño de la página.
- `content/textos.json`: todos los textos (español e inglés) y los datos de contacto. Se editan desde el panel.
- `img/`: las imágenes de la página.
- `build.js`: une la plantilla con los textos y deja la página lista en `dist/`. Netlify lo hace solo cada vez que hay un cambio.
- `admin/`: el panel de edición (Decap CMS), que se abre en `/admin` dentro de la dirección de la página.

## Editar textos

Entra a `https://<dirección-de-la-página>/admin`, inicia sesión con GitHub, cambia lo que necesites y pulsa **Publicar**. En uno o dos minutos el cambio aparece en la página.

## Probar en el computador

```
node build.js
```

y abre `dist/index.html` con un servidor local (por ejemplo `npx serve dist`).
