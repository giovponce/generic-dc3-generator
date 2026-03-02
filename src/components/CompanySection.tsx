import type { CourseErrors } from "../types";

type Props = {
  nombreRazonSocialEmpresa: string;
  rfc: string;
  onNombreChange: (value: string) => void;
  onRfcChange: (value: string) => void;
  courseErrors: CourseErrors;
};

export function CompanySection({
  nombreRazonSocialEmpresa,
  rfc,
  onNombreChange,
  onRfcChange,
  courseErrors
}: Props) {
  return (
    <section className="card">
      <h2>Empresa</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Nombre o razón social</label>
          <input
            value={nombreRazonSocialEmpresa}
            onChange={(e) => onNombreChange(e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="form-group">
          <label>RFC</label>
          <input
            value={rfc}
            className={courseErrors.rfc ? "input-error" : ""}
            maxLength={13}
            onChange={(e) => onRfcChange(e.target.value)}
            placeholder="RFC"
          />
          {courseErrors.rfc && (
            <div className="field-error">{courseErrors.rfc}</div>
          )}
        </div>
      </div>
    </section>
  );
}
