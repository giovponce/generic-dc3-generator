import Select from "react-select";
import DatePicker from "react-datepicker";
import type { StylesConfig } from "react-select";

import type { CourseState } from "../types";
import type { AreaOption } from "../constants/areaOptions";

type Props = {
  course: CourseState;
  customArea: string;
  onCustomAreaChange: (value: string) => void;
  onCourseChange: (patch: Partial<CourseState>) => void;
  onClear: () => void;
  areaOptions: AreaOption[];
  selectStyles: StylesConfig<AreaOption, false>;
};

export function CourseSection({
  course,
  customArea,
  onCustomAreaChange,
  onCourseChange,
  onClear,
  areaOptions,
  selectStyles
}: Props) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Curso</h2>
        <button className="btn-secondary" onClick={onClear}>
          Limpiar
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Nombre del curso</label>
          <input
            value={course.nombreCurso}
            onChange={(e) => onCourseChange({ nombreCurso: e.target.value })}
            placeholder="Escribe el nombre del curso"
          />
        </div>

        <div className="form-group">
          <label>Duración (horas)</label>
          <input
            type="number"
            placeholder="3"
            value={course.duracionEnHoras}
            onChange={(e) =>
              onCourseChange({ duracionEnHoras: Number(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label>Área temática</label>
          <Select
            options={areaOptions}
            placeholder="Selecciona un área temática"
            value={areaOptions.find((a) => a.value === course.areaTematica)}
            onChange={(option) =>
              onCourseChange({ areaTematica: option?.value || "" })
            }
            styles={selectStyles}
          />
        </div>

        {course.areaTematica === "OTHER" && (
          <div className="form-group">
            <label>Otra área temática</label>
            <input
              value={customArea}
              onChange={(e) => onCustomAreaChange(e.target.value)}
              placeholder="Especifica el área temática"
            />
          </div>
        )}

        <div className="form-group">
          <label>Fecha inicio</label>
          <DatePicker
            locale="es"
            selected={course.startDate}
            onChange={(date: Date | null) =>
              onCourseChange({ startDate: date })
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
            onChange={(date: Date | null) => onCourseChange({ endDate: date })}
            dateFormat="dd/MM/yyyy"
            className="input"
            placeholderText="Seleccionar fecha"
          />
        </div>
      </div>
    </section>
  );
}
