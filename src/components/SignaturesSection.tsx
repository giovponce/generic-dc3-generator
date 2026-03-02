type Props = {
  instructor: string;
  patron: string;
  representanteTrabajadores: string;
  onInstructorChange: (value: string) => void;
  onPatronChange: (value: string) => void;
  onRepresentanteTrabajadoresChange: (value: string) => void;
};

export function SignaturesSection({
  instructor,
  patron,
  representanteTrabajadores,
  onInstructorChange,
  onPatronChange,
  onRepresentanteTrabajadoresChange
}: Props) {
  return (
    <section className="card">
      <h2>Firmas</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Instructor (requerido)</label>
          <input
            value={instructor}
            onChange={(e) => onInstructorChange(e.target.value)}
            placeholder="Nombre del instructor"
          />
        </div>

        <div className="form-group">
          <label>Patrón / Representante legal (opcional)</label>
          <input
            value={patron}
            onChange={(e) => onPatronChange(e.target.value)}
            placeholder="Nombre (opcional)"
          />
        </div>

        <div className="form-group">
          <label>Representante de los trabajadores (opcional)</label>
          <input
            value={representanteTrabajadores}
            onChange={(e) => onRepresentanteTrabajadoresChange(e.target.value)}
            placeholder="Nombre (opcional)"
          />
        </div>
      </div>
    </section>
  );
}
