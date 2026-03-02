# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # DC3 Generator

  A small tool to create DC3 Word documents from a React + TypeScript frontend and a tiny Express server that uses Docxtemplater.

  # DC3 Generator

  A small tool to create DC3 Word documents from a React + TypeScript frontend and a tiny Express server that uses Docxtemplater.

  Structure
  - Frontend: React + TypeScript + Vite (source in `src/`).
  - Server: Express in `server/server.cjs` that reads `server/template.docx` and returns a generated `.docx`.

  Features
  - Fill a Word template per-worker and download a combined `.docx`.
  - Bulk paste tab-separated worker rows (Nombre, CURP, Ocupación, Puesto).
  - Basic server-side validation with helpful 400 response when input is missing.

  Prerequisites
  - Node.js (16+ recommended)
  - npm or yarn

  Getting started
  1. Install dependencies (root):

  ```bash
  npm install
  ```

  2. Run the backend server (from the project root):

  ```bash
  # simple:
  node server/server.cjs

  # or with automatic restart during development (if you have nodemon):
  npx nodemon server/server.cjs
  ```

  The server listens on port `3001` by default.

  3. Run the frontend dev server:

  ```bash
  npm run dev
  ```

  Open the Vite dev URL (usually `http://localhost:5173`).

  API
  - Endpoint: `POST http://localhost:3001/generate`
  - Expected JSON body:

  ```json
  {
    "shared": {
      "nombreCurso": "Curso X",
      "duracionEnHoras": 3,
      "areaTematica": "Seguridad",
      "startDate": "01/02/2026",
      "endDate": "02/02/2026",
      "nombreRazonSocialEmpresa": "ACME S.A.",
      "rfc": "ACMERFC123"
    },
    "workers": [
      { "nombre": "Juan Pérez", "curp": "JUAP800101HDFRNN09", "ocupacion": "Operario", "puesto": "Linea 1" }
    ]
  }
  ```

  - Responses:
    - `200` with a `.docx` attachment on success.
    - `400` with message when `shared` or a non-empty `workers` array is missing.
    - `500` for server/template processing errors.

  Frontend usage notes
  - The UI lets you fill course and company data, add workers manually, or paste a tab-separated table and import rows.
  - Date inputs are converted to `DD/MM/YYYY` before being sent to the server.
  - Clicking **Generar DC3** posts to the API and downloads `DC3_multiple.docx`.

  Troubleshooting
  - Ensure `server/template.docx` exists and is a valid docx template.
  - CORS is enabled on the server for the dev setup; if you change ports, update the frontend URL accordingly.
  - If the server returns 400, check the request payload contains both `shared` and a non-empty `workers` array.

  Ideas / next improvements
  - Validate required fields (RFC format, CURP length, dates) and return field-specific errors.
  - Add an `AbortController` to cancel long requests from the frontend.
  - Replace `alert` messages with in-UI error banners.

  License
  - MIT

  ---
  Generated README for the DC3 generator project.
  - CORS is enabled on the server for the dev setup; if you change ports, update the frontend URL accordingly.
  - If the server returns 400, check the request payload contains both `shared` and a non-empty `workers` array.

  Ideas / next improvements
  - Validate required fields (RFC format, CURP length, dates) and return field-specific errors.
  - Add an `AbortController` to cancel long requests from the frontend.
  - Replace `alert` messages with in-UI error banners.

  License
  - MIT

  ---
  Generated README for the DC3 generator project.
