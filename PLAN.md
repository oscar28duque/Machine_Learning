# 🧠 AI Academy — Plan de Desarrollo (Cursor)

## Descripción General
Landing page educativa sobre cursos de Inteligencia Artificial con chatbot integrado
usando la API de Google Gemini. Arquitectura modular, escalable y con buenas
prácticas de desarrollo web (HTML + CSS + JS vanilla, sin frameworks).

---

## Stack Tecnológico
| Capa        | Tecnología                              |
|-------------|-----------------------------------------|
| Markup      | HTML5 semántico                         |
| Estilos     | CSS3 (Custom Properties + Grid/Flex)    |
| Lógica      | JavaScript ES6+ (módulos nativos)       |
| Chatbot API | Google Gemini (gemini-2.0-flash)        |
| Fuentes     | Google Fonts (Syne + DM Sans)           |
| Deploy      | Cualquier hosting estático (Netlify…)   |

---

## Paleta de Colores
| Token                 | Valor     | Uso                          |
|-----------------------|-----------|------------------------------|
| `--color-primary`     | `#16a34a` | Verde principal (CTA, nav)   |
| `--color-accent`      | `#2563eb` | Azul acento (links, badges)  |
| `--color-bg`          | `#ffffff` | Fondo blanco                 |
| `--color-surface`     | `#f0fdf4` | Verde muy suave (cards)      |
| `--color-text`        | `#0f172a` | Texto oscuro                 |
| `--color-muted`       | `#64748b` | Texto secundario             |

---

## Arquitectura de Archivos

```
ai-academy/
├── index.html                  # Entry point (SPA de una sola página)
├── .env.example                # Plantilla de variables de entorno
├── PLAN.md                     # Este archivo
│
├── css/
│   ├── variables.css           # Design tokens: colores, tipografía, espaciado
│   ├── reset.css               # Normalización cross-browser
│   ├── layout.css              # Sidebar, grid principal, contenedores
│   ├── components.css          # Cards, botones, badges, timeline, formulario
│   └── chatbot.css             # Widget flotante del chatbot
│
└── js/
    ├── app.js                  # Bootstrap: inicializa módulos y router
    ├── router.js               # Enrutador SPA por hash (#home, #courses…)
    │
    ├── data/
    │   ├── courses.js          # Datos de los 5 cursos (precio, módulos, etc.)
    │   ├── instructors.js      # Perfiles de instructores
    │   └── knowledge.js        # Base de conocimiento para el chatbot
    │
    ├── modules/
    │   ├── home.js             # Vista: Historia de la IA (timeline)
    │   ├── courses.js          # Vista: listado + detalle de cursos
    │   ├── instructors.js      # Vista: perfiles de instructores
    │   └── contact.js          # Vista: formulario de contacto
    │
    └── chatbot/
        ├── gemini.js           # Cliente fetch para Gemini API
        ├── knowledge.js        # RAG local: búsqueda en base de conocimiento
        └── chatbot.js          # UI del widget, historial, toggle
```

---

## Módulos del Sistema

### Router (`js/router.js`)
- SPA sin librerías: navegación por `window.location.hash`
- Rutas: `#home` · `#courses` · `#courses/:id` · `#instructors` · `#contact`
- Lazy render: cada cambio de ruta llama al módulo correspondiente

### Data Layer (`js/data/`)
- **Fuente única de verdad** para cursos e instructores
- Exportación como módulos ES6 (`export const`)
- Agregar un curso = editar solo `courses.js`, sin tocar UI

### Chatbot (`js/chatbot/`)
- `gemini.js`: wrapper de `fetch` para la API de Gemini
- `knowledge.js`: búsqueda local por palabras clave antes de llamar a la API
- `chatbot.js`: widget flotante, historial de mensajes, sugerencias rápidas
- **System prompt restrictivo**: el bot solo responde sobre AI Academy

### Vistas (`js/modules/`)
- Patrón: `render(container)` → genera HTML → monta en `<main>`
- Componentes internos reutilizables: `createCard()`, `createBadge()`, etc.

---

## Cursos y Precios

| # | Título                                    | Duración  | Nivel               | Precio (COP)   |
|---|-------------------------------------------|-----------|---------------------|----------------|
| 1 | Fundamentos de Inteligencia Artificial    | 8 semanas | Básico              | $189.000       |
| 2 | Introducción a Machine Learning           | 10 semanas| Básico-Intermedio   | $245.000       |
| 3 | Machine Learning y Algoritmos Genéticos   | 12 semanas| Intermedio          | $310.000       |
| 4 | Deep Learning: Fundamentos                | 10 semanas| Intermedio-Avanzado | $289.000       |
| 5 | Aplicaciones de Deep Learning             | 12 semanas| Avanzado            | $375.000       |

---

## Instructores

| Nombre                    | Especialidad                              |
|---------------------------|-------------------------------------------|
| Dr. Andrés Mora           | Fundamentos IA & Epistemología computacional |
| Dra. Valentina Cruz       | Machine Learning & Estadística aplicada   |
| Ing. Sebastián Ríos       | Algoritmos Genéticos & Optimización       |
| Dr. Felipe Navarro        | Deep Learning & Redes Neuronales          |
| Oscar Julian Duque Garcia | Desarrollo de Software & Análisis de Datos|

---

## Chatbot — Flujo de Conocimiento

```
Usuario escribe
      │
      ▼
searchKnowledge(query)  ← busca en knowledge.js local (rápido, sin API)
      │
      ├─ Encontrado ──► Retorna respuesta local directamente
      │
      └─ No encontrado ► Llama a Gemini API con:
                            • System prompt restrictivo (solo AI Academy)
                            • Historial de conversación
                            • Contexto del corpus de la academia
                              ▼
                         Respuesta filtrada al dominio
```

---

## Buenas Prácticas Implementadas

- ✅ **Separación de responsabilidades**: datos / lógica / presentación
- ✅ **DRY**: componentes reutilizables (createCard, createBadge, renderHeader)
- ✅ **CSS Custom Properties**: sistema de diseño consistente y temable
- ✅ **ES6 Modules nativos**: sin bundler, imports/exports directos
- ✅ **Variables de entorno**: API key en `.env`, nunca en código fuente
- ✅ **HTML5 semántico**: `<nav>`, `<main>`, `<section>`, `aria-*`
- ✅ **Responsive**: layout adaptable con CSS Grid y media queries
- ✅ **Escalabilidad**: agregar cursos/instructores solo toca archivos `data/`
- ✅ **RAG local**: respuestas rápidas sin consumir tokens de la API

---

## Variables de Entorno

```env
# .env.example
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

> ⚠️ Nunca subas el `.env` real al repositorio. Inclúyelo en `.gitignore`.

---

## Roadmap Futuro

- [ ] Autenticación de estudiantes (Supabase / Firebase)
- [ ] Panel de progreso de cursos
- [ ] Pasarela de pagos (Wompi / MercadoPago COP)
- [ ] Blog de artículos de IA
- [ ] Soporte multilenguaje (i18n)
- [ ] PWA con Service Worker (modo offline)
- [ ] Sistema de certificados descargables
