# DC3 Generator (React + Vite + Express)

A small web app to generate **DC3** Word documents (`.docx`) from course/company data plus a list of workers. The frontend is **React + TypeScript (Vite)** and the backend is a tiny **Express** server using **Docxtemplater**.

## What it does

- Fill course + company + signatures data in the UI.
- Add workers manually or **bulk import** by pasting a tab-separated table (TSV).
- Validates **CURP length (18)** and **RFC length (12 or 13)** in the UI.
- Click **Generar DC3** to download a generated `.docx`.

## Project structure

- **Frontend**: `src/` (React + TS)
  - UI sections live in `src/components/`
- **Backend**: `server/server.cjs` (Express)
  - Template file: `server/templates/template.docx`

## Prerequisites

- **Node.js 18+**
- npm

## Install

From the project root:

```bash
npm install
```

## Run in development (recommended)

You’ll run **two processes**: the Express API and the Vite dev server.

### 1) Start the backend API

From the project root:

```bash
node server/server.cjs
```

The server listens on `http://localhost:3001` by default.

### 2) Start the frontend

In another terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Build + run (single server)

This builds the frontend into `dist/`, then the Express server serves it as static files.

```bash
npm run build
node server/server.cjs
```

Then open `http://localhost:3001`.

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: typecheck + build production frontend
- `npm run preview`: preview the production build (Vite)
- `npm run lint`: run ESLint
- `npm run format`: run Prettier (adds `;` and formats files)

## API

### `POST /generate`

- **URL**: `http://localhost:3001/generate`
- **Body**: JSON with `shared` + `workers`
- **Success**: returns a `.docx` attachment

Example:

```json
{
  "shared": {
    "nombreCurso": "CURSO X",
    "duracionEnHoras": 3,
    "areaTematica": "SEGURIDAD",
    "startDate": "01/02/2026",
    "endDate": "02/02/2026",
    "nombreRazonSocialEmpresa": "ACME S.A. DE C.V.",
    "rfc": "ACME800101XXX",
    "instructor": "NOMBRE INSTRUCTOR",
    "patron": "NOMBRE PATRON",
    "representanteTrabajadores": "NOMBRE REPRESENTANTE"
  },
  "workers": [
    {
      "nombre": "JUAN PEREZ",
      "curp": "JUAP800101HDFRNN09",
      "ocupacion": "OPERARIO",
      "puesto": "LINEA 1"
    }
  ]
}
```

Notes:

- `startDate` and `endDate` must be in **`DD/MM/YYYY`**.
- The server expects RFC with **12 or 13 characters** (it pads to 13 for template splitting).

## Template

The server reads:

- `server/templates/template.docx`

If you replace the template, keep it as a valid `.docx` and ensure the placeholders used by Docxtemplater match what the server sends (the server splits CURP and RFC into per-character fields like `curp1..curp18` and `rfc1..rfc13`).

## Troubleshooting

- **404 Template file not found**: ensure `server/templates/template.docx` exists.
- **400 Invalid data**: ensure the request contains `shared` and a non-empty `workers` array.
- **CORS / network issues in dev**: the frontend calls `http://localhost:3001/generate`; ensure the server is running on port 3001.
