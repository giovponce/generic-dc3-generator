import { useState } from "react";
import "./App.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import type { StylesConfig } from "react-select";

import { AREA_OPTIONS } from "./constants/areaOptions";
import type { AreaOption } from "./constants/areaOptions";
import { BulkImportSection } from "./components/BulkImportSection";
import { CompanySection } from "./components/CompanySection";
import { CourseSection } from "./components/CourseSection";
import { SignaturesSection } from "./components/SignaturesSection";
import { WorkersSection } from "./components/WorkersSection";
import type {
  CourseErrors,
  CourseState,
  SharedData,
  Worker,
  WorkerErrors
} from "./types";
import { formatDate } from "./utils/formatDate";
import { normalizeRfc, normalizeText } from "./utils/normalize";

registerLocale("es", es);

function App() {
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);

  const [customArea, setCustomArea] = useState("");

  const [course, setCourse] = useState<CourseState>({
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
  });

  const [workers, setWorkers] = useState<Worker[]>([
    { nombre: "", curp: "", ocupacion: "", puesto: "" }
  ]);

  const [errors, setErrors] = useState<WorkerErrors[]>(workers.map(() => ({})));

  const [courseErrors, setCourseErrors] = useState<CourseErrors>({});

  const addWorker = () => {
    setWorkers([
      ...workers,
      { nombre: "", curp: "", ocupacion: "", puesto: "" }
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const updateWorker = (index: number, field: keyof Worker, value: string) => {
    const updated = [...workers];

    updated[index][field] = (() => {
      if (field === "curp") {
        return value.replace(/\s+/g, "").toUpperCase().slice(0, 18);
      }
      return normalizeText(value);
    })();

    setWorkers(updated);

    if (field === "curp") {
      const curpClean = (value || "").replace(/\s+/g, "");
      setErrors((prev) => {
        const next = [...prev];
        while (next.length <= index) next.push({});

        if (curpClean.length !== 18) {
          next[index] = {
            ...next[index],
            curp: "CURP debe tener 18 caracteres"
          };
        } else {
          const current = next[index] || {};
          const rest = Object.fromEntries(
            Object.entries(current).filter(([k]) => k !== "curp")
          ) as WorkerErrors;
          next[index] = rest;
        }

        return next;
      });
    }
  };

  const removeWorker = (index: number) => {
    setWorkers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkPaste = (text: string) => {
    if (!text) return;

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedWorkers = lines.map((line) => {
      const cols = line.split("\t");

      return {
        nombre: normalizeText(cols[0] || ""),
        curp: (cols[1] || "").replace(/\s+/g, "").toUpperCase(),
        ocupacion: normalizeText(cols[2] || ""),
        puesto: normalizeText(cols[3] || "")
      };
    });

    setWorkers(parsedWorkers.length ? parsedWorkers : workers);
    if (parsedWorkers.length) setErrors(parsedWorkers.map(() => ({})));
  };

  const updateCourse = (patch: Partial<CourseState>) => {
    setCourse((prev) => ({ ...prev, ...patch }));
  };

  const clearCourse = () => {
    setCourseErrors({});
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
    });
    setCustomArea("");
  };

  const handleRfcChange = (value: string) => {
    const rfc = normalizeRfc(value);
    setCourse((prev) => ({ ...prev, rfc }));

    setCourseErrors((prev) => {
      if (rfc.length !== 12 && rfc.length !== 13) {
        return { ...prev, rfc: "RFC debe tener 12 o 13 caracteres" };
      }
      return {};
    });
  };

  const generateAll = async () => {
    // CURP validation
    const nextErrors = workers.map((w) => {
      const curp = (w.curp || "").replace(/\s+/g, "");
      return curp.length !== 18
        ? { curp: "CURP debe tener 18 caracteres" }
        : {};
    });

    const hasErrors = nextErrors.some((e) => Object.keys(e).length > 0);
    if (hasErrors) {
      setErrors(nextErrors);
      const first = nextErrors.findIndex((e) => e.curp);
      alert(
        `CURP inv?lida en trabajador ${first + 1}. Por favor corrige antes de generar.`
      );
      return;
    }

    // Basic required fields validation (portfolio-friendly)
    const areaFinal =
      course.areaTematica === "OTHER" ? customArea : course.areaTematica;

    if (!course.nombreCurso.trim()) {
      alert("Por favor escribe el nombre del curso.");
      return;
    }

    if (!course.duracionEnHoras || course.duracionEnHoras <= 0) {
      alert("Por favor ingresa la duraci?n en horas.");
      return;
    }

    if (!areaFinal.trim()) {
      alert("Por favor selecciona un ?rea tem?tica (o escribe una en 'OTRA').");
      return;
    }

    if (!course.startDate || !course.endDate) {
      alert("Por favor selecciona fecha inicio y fecha fin.");
      return;
    }

    if (!course.nombreRazonSocialEmpresa.trim()) {
      alert("Por favor ingresa el nombre o raz?n social de la empresa.");
      return;
    }

    const rfcClean = (course.rfc || "").replace(/\s+/g, "");
    if (!rfcClean.trim()) {
      setCourseErrors({ rfc: "RFC debe tener 12 o 13 caracteres" });
      alert("Por favor ingresa el RFC.");
      return;
    }

    if (rfcClean.length !== 12 && rfcClean.length !== 13) {
      setCourseErrors({ rfc: "RFC debe tener 12 o 13 caracteres" });
      alert("RFC inv?lido. Debe tener 12 o 13 caracteres.");
      return;
    }

    if (!course.instructor.trim()) {
      alert("Por favor ingresa el nombre del instructor.");
      return;
    }

    setLoading(true);

    const sharedData: SharedData = {
      nombreCurso: course.nombreCurso.trim().toUpperCase(),
      duracionEnHoras: Number(course.duracionEnHoras),
      areaTematica: areaFinal.trim().toUpperCase(),
      startDate: formatDate(course.startDate),
      endDate: formatDate(course.endDate),
      nombreRazonSocialEmpresa: course.nombreRazonSocialEmpresa
        .trim()
        .toUpperCase(),
      rfc: course.rfc.trim().toUpperCase(),
      instructor: course.instructor.trim().toUpperCase(),
      patron: course.patron.trim()
        ? course.patron.trim().toUpperCase()
        : undefined,
      representanteTrabajadores: course.representanteTrabajadores.trim()
        ? course.representanteTrabajadores.trim().toUpperCase()
        : undefined
    };

    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shared: sharedData,
          workers
        })
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        alert(`Error generating document${text ? `: ${text}` : ""}`);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "DC3_multiple.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Network error while generating document");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles: StylesConfig<AreaOption, false> = {
    control: (base, state) => ({
      ...base,
      borderRadius: 10,
      padding: "4px 6px",
      borderColor: state.isFocused ? "#4f46e5" : "#d0d5dd",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(79, 70, 229, 0.15)" : "none",
      "&:hover": {
        borderColor: "#4f46e5"
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 10,
      overflow: "hidden"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
          ? "#eef2ff"
          : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer"
    })
  };

  return (
    <div className="container">
      <h1 className="title">Generador DC3</h1>

      <CourseSection
        course={course}
        customArea={customArea}
        onCustomAreaChange={(v) => setCustomArea(normalizeText(v))}
        onCourseChange={(patch) => {
          const next: Partial<CourseState> = { ...patch };
          if (typeof next.nombreCurso === "string") {
            next.nombreCurso = normalizeText(next.nombreCurso);
          }
          updateCourse(next);
        }}
        onClear={clearCourse}
        areaOptions={AREA_OPTIONS}
        selectStyles={customSelectStyles}
      />

      <CompanySection
        nombreRazonSocialEmpresa={course.nombreRazonSocialEmpresa}
        rfc={course.rfc}
        onNombreChange={(v) =>
          updateCourse({ nombreRazonSocialEmpresa: normalizeText(v) })
        }
        onRfcChange={handleRfcChange}
        courseErrors={courseErrors}
      />

      <SignaturesSection
        instructor={course.instructor}
        patron={course.patron}
        representanteTrabajadores={course.representanteTrabajadores}
        onInstructorChange={(v) =>
          updateCourse({ instructor: normalizeText(v) })
        }
        onPatronChange={(v) => updateCourse({ patron: normalizeText(v) })}
        onRepresentanteTrabajadoresChange={(v) =>
          updateCourse({ representanteTrabajadores: normalizeText(v) })
        }
      />

      <BulkImportSection
        bulkText={bulkText}
        onBulkTextChange={(v) => setBulkText(v.toUpperCase())}
        onImport={() => {
          handleBulkPaste(bulkText);
          setBulkText("");
        }}
      />

      <WorkersSection
        workers={workers}
        errors={errors}
        onAddWorker={addWorker}
        onRemoveWorker={removeWorker}
        onUpdateWorker={updateWorker}
      />

      <button
        className="btn-primary full-width"
        onClick={generateAll}
        disabled={loading}
      >
        {loading ? "Generando..." : "Generar DC3"}
      </button>
    </div>
  );
}

export default App;
