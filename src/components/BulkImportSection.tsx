type Props = {
  bulkText: string;
  onBulkTextChange: (value: string) => void;
  onImport: () => void;
};

export function BulkImportSection({
  bulkText,
  onBulkTextChange,
  onImport
}: Props) {
  return (
    <section className="card">
      <h2>Importar trabajadores</h2>

      <textarea
        rows={5}
        value={bulkText}
        onChange={(e) => onBulkTextChange(e.target.value)}
        placeholder="Pega aqui tu tabla de trabajadores (Nombre, CURP, Ocupación, Puesto) separada por tabulaciones"
      />

      <div className="btn-container">
        <button className="btn-primary" onClick={onImport}>
          Importar
        </button>
      </div>
    </section>
  );
}
