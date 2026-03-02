import type { Worker, WorkerErrors } from "../types";

type Props = {
  workers: Worker[];
  errors: WorkerErrors[];
  onAddWorker: () => void;
  onRemoveWorker: (index: number) => void;
  onUpdateWorker: (index: number, field: keyof Worker, value: string) => void;
};

export function WorkersSection({
  workers,
  errors,
  onAddWorker,
  onRemoveWorker,
  onUpdateWorker
}: Props) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>Trabajadores</h2>
        <button className="btn-secondary" onClick={onAddWorker}>
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
                onClick={() => onRemoveWorker(index)}
              >
                ✕
              </button>
            </div>

            <div className="worker-fields">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  value={worker.nombre}
                  onChange={(e) =>
                    onUpdateWorker(index, "nombre", e.target.value)
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
                    onUpdateWorker(index, "curp", e.target.value)
                  }
                />
                {errors[index]?.curp && (
                  <div className="field-error">{errors[index].curp}</div>
                )}
              </div>

              <div className="form-group">
                <label>Ocupación</label>
                <input
                  value={worker.ocupacion}
                  onChange={(e) =>
                    onUpdateWorker(index, "ocupacion", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Puesto</label>
                <input
                  value={worker.puesto}
                  onChange={(e) =>
                    onUpdateWorker(index, "puesto", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
