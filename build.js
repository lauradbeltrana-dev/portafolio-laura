// Arma la página final (carpeta dist/) a partir de la plantilla y de los textos
// que Laura edita en el panel (content/textos.json). Netlify lo corre solo en cada cambio.
const fs = require("fs");
const path = require("path");

const raiz = __dirname;
const dist = path.join(raiz, "dist");
const datos = JSON.parse(fs.readFileSync(path.join(raiz, "content/textos.json"), "utf8"));
let html = fs.readFileSync(path.join(raiz, "src/plantilla.html"), "utf8");

const limpio = (s) => String(s ?? "").trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
const lineas = (s) => String(s ?? "").trim().split(/\r?\n/).map(limpio).join("<br>");
const parrafos = (s) => String(s ?? "").trim().split(/\r?\n\s*\r?\n/).map(lineas).join("<br><br>");
const lista = (a) => (Array.isArray(a) ? a : []);
const item = (x, k) => (x && typeof x === "object" ? x[k] : x);

function textos(t, idioma) {
  const s = t.sobre_mi, g = t.galeria;
  return {
    h_port: limpio(t.inicio.titulo), h_2025: limpio(t.inicio.anio),
    nav_about: limpio(t.menu.sobre_mi), nav_brand: limpio(t.menu.branding), nav_social: limpio(t.menu.social),
    nav_mur: limpio(t.menu.murales), nav_gal: limpio(t.menu.galeria),
    hola: limpio(s.saludo), laura: limpio(s.nombre), beltran: limpio(s.apellido),
    bio: parrafos(s.bio),
    edu_t: limpio(s.educacion_titulo),
    edu: lista(s.educacion).map((e) => `<b>${limpio(e.lugar)}</b><br>${limpio(e.titulo)}`).join("<br><br>"),
    exp_t: limpio(s.experiencia_titulo),
    exp: lista(s.experiencia).map((j) =>
      `<span class="job"><b>${limpio(j.empresa)}</b><br>${limpio(j.cargo)}` +
      lista(j.tareas).map((x) => `<span class="li">• ${limpio(item(x, "tarea"))}</span>`).join("") + "</span>").join(""),
    sk_t: limpio(s.skills_titulo),
    sk: lista(s.skills).map((x) => limpio(item(x, "skill"))).join("<br>"),
    h_brand: limpio(t.branding.titulo), remake: limpio(t.branding.proyecto_1), venture: limpio(t.branding.proyecto_2),
    h_gal: limpio(g.titulo),
    col_s: lineas(g.color.linea_1), col_b: lineas(g.color.linea_2), col_p: parrafos(g.color.texto),
    dib_s: lineas(g.dibujo.linea_1), dib_b: lineas(g.dibujo.linea_2), dib_p: parrafos(g.dibujo.texto),
    gou_s: lineas(g.gouache.linea_1), gou_b: lineas(g.gouache.linea_2), gou_p: parrafos(g.gouache.texto),
    tex_s: lineas(g.texturas.linea_1), tex_b: lineas(g.texturas.linea_2), tex_p: parrafos(g.texturas.texto),
    fb_s: lineas(g.firebee.linea_1), fb_b: lineas(g.firebee.linea_2),
    lp_s: lineas(g.longplay.linea_1), lp_b: lineas(g.longplay.linea_2),
    h_soc: limpio(t.social.titulo), h_mur: limpio(t.murales.titulo),
    mar: limpio(t.murales.mural_1), selva: limpio(t.murales.mural_2),
    alt_wa: idioma === "es" ? "Escribir por WhatsApp" : "Message on WhatsApp",
    alt_mail: idioma === "es" ? "Escribir un correo" : "Send an email",
  };
}

const T = { es: textos(datos.es, "es"), en: textos(datos.en, "en") };

// Texto en español ya escrito en la página (se ve aunque el navegador tarde en cargar el código)
html = html.replace(/(data-i="([a-z_0-9]+)"[^>]*>)([\s\S]*?)(<\/(?:h1|div|p|a)>)/g, (m, abre, clave, _viejo, cierra) =>
  clave in T.es ? abre + T.es[clave] + cierra : m);
html = html.replace("const T=__TEXTOS__;", () => "const T=" + JSON.stringify(T).replace(/</g, "\\u003c") + ";");

const c = datos.contacto;
const attr = (s) => limpio(s).replace(/"/g, "&quot;");
const descripcion = String(datos.es.sobre_mi.bio || "").split(/\r?\n/)[0].replace(/\s+/g, " ").trim().slice(0, 155);
const sitio = (process.env.URL || "").replace(/\/$/, "");
const reemplazos = {
  "{{CORREO}}": attr(c.correo),
  "{{WA}}": String(c.whatsapp).replace(/\D/g, ""),
  "{{WA_VISIBLE}}": attr(c.whatsapp_visible),
  "{{BEHANCE}}": encodeURIComponent(String(c.behance).trim()),
  "{{DESCRIPCION}}": attr(descripcion),
  "{{SITIO}}": sitio,
};
for (const [k, v] of Object.entries(reemplazos)) html = html.split(k).join(v);
if (/\{\{[A-Z_]+\}\}|__TEXTOS__/.test(html)) throw new Error("Quedó un espacio sin llenar en la plantilla");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), html);
for (const x of ["img", "admin", "favicon.png", "apple-touch-icon.png"]) {
  fs.cpSync(path.join(raiz, x), path.join(dist, x), { recursive: true });
}
console.log("Página lista en dist/");
