import { useState } from "react"
import "./App.css"
import Select from "react-select"
import DatePicker from "react-datepicker"
import { registerLocale } from "react-datepicker"
import { es } from "date-fns/locale"

registerLocale("es", es)

type Worker = {
  nombre: string
  curp: string
  ocupacion: string
  puesto: string
}

type SharedData = {
  nombreCurso: string
  duracionEnHoras: number
  areaTematica: string
  startDate: string
  endDate: string
  nombreRazonSocialEmpresa: string
  rfc: string
  instructor: string
  patron?: string
  representanteTrabajadores?: string
}

const AREA_OPTIONS = [
  { label: "6000 SEGURIDAD", value: "6000 SEGURIDAD" },
  { label: "6100 SEGURIDAD INDUSTRIAL", value: "6100 SEGURIDAD INDUSTRIAL" },
  { label: "6400 HIGIENE Y SEGURIDAD EN EL TRABAJO", value: "6400 HIGIENE Y SEGURIDAD EN EL TRABAJO" },
  { label: "OTRA", value: "OTHER" }
]

function App() {
  const [bulkText, setBulkText] = useState("")
  const [loading, setLoading] = useState(false)

  const [customArea, setCustomArea] = useState("")

  const [course, setCourse] = useState({
    nombreCurso: "",
    duracionEnHoras: 0,
    areaTematica: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    instructor: "",
    patron: "",
    representanteTrabajadores: "",
    nombreRazonSocialEmpresa: "",
    rfc: ""
  })

  const [workers, setWorkers] = useState<Worker[]>([
    { nombre: "", curp: "", ocupacion: "", puesto: "" }
  ])

  const [errors, setErrors] = useState<{ curp?: string }[]>(
    workers.map(() => ({}))
  )

  const [courseErrors, setCourseErrors] = useState<{ rfc?: string }>({})

  const normalizeText = (text: string) =>
    text.replace(/\s+/g, " ").toUpperCase()

  const normalizeRfc = (text: string) =>
    text.replace(/\s+/g, "").toUpperCase().slice(0, 13)

  const addWorker = () => {
    setWorkers([
      ...workers,
      { nombre: "", curp: "", ocupacion: "", puesto: "" }
    ])
    setErrors((prev) => [...prev, {}])
  }

  const updateWorker = (
    index: number,
    field: keyof Worker,
    value: string
  ) => {
    const updated = [...workers]

    updated[index][field] =
      (() => {
        if (field === "curp") {
          return value.replace(/\s+/g, "").toUpperCase().slice(0, 18)
        }
        return normalizeText(value)
      })()

    setWorkers(updated)

    if (field === "curp") {
      const curpClean = (value || "").replace(/\s+/g, "")
      setErrors((prev) => {
        const next = [...prev]
        while (next.length <= index) next.push({})

        if (curpClean.length !== 18) {
          next[index] = { ...next[index], curp: "CURP debe tener 18 caracteres" }
        } else {
          const { curp, ...rest } = next[index] || {}
          next[index] = Object.keys(rest).length ? rest : {}
        }

        return next
      })
    }
  }

  const removeWorker = (index: number) => {
    setWorkers((prev) => prev.filter((_, i) => i !== index))
    setErrors((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBulkPaste = (text: string) => {
    if (!text) return

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)

    const parsedWorkers = lines.map((line) => {
      const cols = line.split("\t")

      return {
        nombre: normalizeText(cols[0] || ""),
        curp: (cols[1] || "").replace(/\s+/g, "").toUpperCase(),
        ocupacion: normalizeText(cols[2] || ""),
        puesto: normalizeText(cols[3] || "")
      }
    })

    setWorkers(parsedWorkers.length ? parsedWorkers : workers)
    if (parsedWorkers.length) setErrors(parsedWorkers.map(() => ({})))
  }

  const generateAll = async () => {
    // CURP validation
    const nextErrors = workers.map((w) => {
      const curp = (w.curp || "").replace(/\s+/g, "")
      return curp.length !== 18 ? { curp: "CURP debe tener 18 caracteres" } : {}
    })

    const hasErrors = nextErrors.some((e) => Object.keys(e).length > 0)
    if (hasErrors) {
      setErrors(nextErrors)
      const first = nextErrors.findIndex((e) => e.curp)
      alert(`CURP inv?lida en trabajador ${first + 1}. Por favor corrige antes de generar.`)
      return
    }

    // Basic required fields validation (portfolio-friendly)
    const areaFinal = course.areaTematica === "OTHER" ? customArea : course.areaTematica

    if (!course.nombreCurso.trim()) {
      alert("Por favor escribe el nombre del curso.")
      return
    }

    if (!course.duracionEnHoras || course.duracionEnHoras <= 0) {
      alert("Por favor ingresa la duraci?n en horas.")
      return
    }

    if (!areaFinal.trim()) {
      alert("Por favor selecciona un ?rea tem?tica (o escribe una en 'OTRA').")
      return
    }

    if (!course.startDate || !course.endDate) {
      alert("Por favor selecciona fecha inicio y fecha fin.")
      return
    }

    if (!course.nombreRazonSocialEmpresa.trim()) {
      alert("Por favor ingresa el nombre o raz?n social de la empresa.")
      return
    }

    const rfcClean = (course.rfc || "").replace(/\s+/g, "")
    if (!rfcClean.trim()) {
      setCourseErrors({ rfc: "RFC debe tener 12 o 13 caracteres" })
      alert("Por favor ingresa el RFC.")
      return
    }

    if (rfcClean.length !== 12 && rfcClean.length !== 13) {
      setCourseErrors({ rfc: "RFC debe tener 12 o 13 caracteres" })
      alert("RFC inv?lido. Debe tener 12 o 13 caracteres.")
      return
    }

    if (!course.instructor.trim()) {
      alert("Por favor ingresa el nombre del instructor.")
      return
    }

    setLoading(true)

    const sharedData: SharedData = {
      nombreCurso: course.nombreCurso.trim().toUpperCase(),
      duracionEnHoras: Number(course.duracionEnHoras),
      areaTematica: areaFinal.trim().toUpperCase(),
      startDate: formatDate(course.startDate),
      endDate: formatDate(course.endDate),
      nombreRazonSocialEmpresa: course.nombreRazonSocialEmpresa.trim().toUpperCase(),
      rfc: course.rfc.trim().toUpperCase(),
      instructor: course.instructor.trim().toUpperCase(),
      patron: course.patron.trim() ? course.patron.trim().toUpperCase() : undefined,
      representanteTrabajadores: course.representanteTrabajadores.trim()
        ? course.representanteTrabajadores.trim().toUpperCase()
        : undefined
    }

    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shared: sharedData,
          workers
        })
      })

      if (!response.ok) {
        const text = await response.text().catch(() => null)
        alert(`Error generating document${text ? `: ${text}` : ""}`)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "DC3_multiple.docx"
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Network error while generating document")
    } finally {
      setLoading(false)
    }
  }

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: 10,
      padding: "4px 6px",
      borderColor: state.isFocused ? "#4f46e5" : "#d0d5dd",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(79, 70, 229, 0.15)"
        : "none",
      "&:hover": {
        borderColor: "#4f46e5"
      }
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 10,
      overflow: "hidden"
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
        ? "#eef2ff"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer"
    })
  }

  return (
    <div className="container">
      <h1 className="title">Generador DC3</h1>

      {/* COURSE */}
      <section className="card">
        <div className="card-header">
          <h2>Curso</h2>
          <button
            className="btn-secondary"
            onClick={() =>
              (setCourseErrors({}),
              setCourse({
                nombreCurso: "",
                duracionEnHoras: 0,
                areaTematica: "",
                startDate: null,
                endDate: null,
                instructor: "",
                patron: "",
                representanteTrabajadores: "",
                nombreRazonSocialEmpresa: "",
                rfc: ""
              }))
            }
          >
            Limpiar
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre del curso</label>
            <input
              value={course.nombreCurso}
              onChange={(e) =>
                setCourse({
                  ...course,
                  nombreCurso: normalizeText(e.target.value)
                })
              }
              placeholder="Escribe el nombre del curso"
            />
          </div>

          <div className="form-group">
            <label>Duraci?n (horas)</label>
            <input
              type="number"
              placeholder="3"
              value={course.duracionEnHoras}
              onChange={(e) =>
                setCourse({
                  ...course,
                  duracionEnHoras: Number(e.target.value)
                })
              }
            />
          </div>

          <div className="form-group">
            <label>?rea tem?tica</label>
            <Select
              options={AREA_OPTIONS}
              placeholder="Selecciona un ?rea tem?tica"
              value={AREA_OPTIONS.find((a) => a.value === course.areaTematica)}
              onChange={(option) =>
                setCourse({
                  ...course,
                  areaTematica: option?.value || ""
                })
              }
              styles={customSelectStyles}
            />
          </div>

          {course.areaTematica === "OTHER" && (
            <div className="form-group">
              <label>Otra ?rea tem?tica</label>
              <input
                value={customArea}
                onChange={(e) => setCustomArea(normalizeText(e.target.value))}
                placeholder="Especifica el ?rea tem?tica"
              />
            </div>
          )}

          <div className="form-group">
            <label>Fecha inicio</label>
            <DatePicker
              locale="es"
              selected={course.startDate}
              onChange={(date: Date | null) =>
                setCourse({ ...course, startDate: date })
              }
              dateFormat="dd/MM/yyyy"
              className="input"
              placeholderText="Seleccionar fecha"
            />
          </div>

          <div className="form-group">
            <label>Fecha fin</label>
            <DatePicker
              locale="es"
              selected={course.endDate}
              onChange={(date: Date | null) =>
                setCourse({ ...course, endDate: date })
              }
              dateFormat="dd/MM/yyyy"
              className="input"
              placeholderText="Seleccionar fecha"
            />
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="card">
        <h2>Empresa</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre o raz?n social</label>
            <input
              value={course.nombreRazonSocialEmpresa}
              onChange={(e) =>
                setCourse({
                  ...course,
                  nombreRazonSocialEmpresa: normalizeText(e.target.value)
                })
              }
              placeholder="Nombre de la empresa"
            />
          </div>

          <div className="form-group">
            <label>RFC</label>
            <input
              value={course.rfc}
              className={courseErrors.rfc ? "input-error" : ""}
              maxLength={13}
              onChange={(e) => {
                const rfc = normalizeRfc(e.target.value)
                setCourse({ ...course, rfc })

                setCourseErrors((prev) => {
                  if (rfc.length !== 12 && rfc.length !== 13) {
                    return { ...prev, rfc: "RFC debe tener 12 o 13 caracteres" }
                  }
                  const { rfc: _rfc, ...rest } = prev || {}
                  return rest
                })
              }}
              placeholder="RFC"
            />
            {courseErrors.rfc && (
              <div className="field-error">{courseErrors.rfc}</div>
            )}
          </div>
        </div>
      </section>

      {/* SIGNATURES */}
      <section className="card">
        <h2>Firmas</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Instructor (requerido)</label>
            <input
              value={course.instructor}
              onChange={(e) =>
                setCourse({
                  ...course,
                  instructor: normalizeText(e.target.value)
                })
              }
              placeholder="Nombre del instructor"
            />
          </div>

          <div className="form-group">
            <label>Patr?n / Representante legal (opcional)</label>
            <input
              value={course.patron}
              onChange={(e) =>
                setCourse({
                  ...course,
                  patron: normalizeText(e.target.value)
                })
              }
              placeholder="Nombre (opcional)"
            />
          </div>

          <div className="form-group">
            <label>Representante de los trabajadores (opcional)</label>
            <input
              value={course.representanteTrabajadores}
              onChange={(e) =>
                setCourse({
                  ...course,
                  representanteTrabajadores: normalizeText(e.target.value)
                })
              }
              placeholder="Nombre (opcional)"
            />
          </div>
        </div>
      </section>

      {/* BULK IMPORT */}
      <section className="card">
        <h2>Importar trabajadores</h2>

        <textarea
          rows={5}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value.toUpperCase())}
          placeholder="Pega aqui tu tabla de trabajadores (Nombre, CURP, Ocupaci?n, Puesto) separada por tabulaciones"
        />

        <div className="btn-container">
          <button
            className="btn-primary"
            onClick={() => {
              handleBulkPaste(bulkText)
              setBulkText("")
            }}
          >
            Importar
          </button>
        </div>
      </section>

      {/* WORKERS */}
      <section className="card">
        <div className="card-header">
          <h2>Trabajadores</h2>
          <button className="btn-secondary" onClick={addWorker}>
            + Agregar
          </button>
        </div>

        <div className="workers-section">
          {workers.map((worker, index) => (
            <div key={index} className="worker-card">
              <div className="worker-card-header">
                <h4>Trabajador {index + 1}</h4>
                <button
                  type="button"
                  className="btn-danger delete-btn"
                  onClick={() => removeWorker(index)}
                >
                  ?
                </button>
              </div>

              <div className="worker-fields">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    value={worker.nombre}
                    onChange={(e) =>
                      updateWorker(index, "nombre", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>CURP</label>
                  <input
                    className={errors[index]?.curp ? "input-error" : ""}
                    maxLength={18}
                    value={worker.curp}
                    onChange={(e) =>
                      updateWorker(index, "curp", e.target.value)
                    }
                  />
                  {errors[index]?.curp && (
                    <div className="field-error">{errors[index].curp}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Ocupaci?n</label>
                  <input
                    value={worker.ocupacion}
                    onChange={(e) =>
                      updateWorker(index, "ocupacion", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Puesto</label>
                  <input
                    value={worker.puesto}
                    onChange={(e) =>
                      updateWorker(index, "puesto", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        className="btn-primary full-width"
        onClick={generateAll}
        disabled={loading}
      >
        {loading ? "Generando..." : "Generar DC3"}
      </button>
    </div>
  )
}

const formatDate = (date: Date | null) => {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default App