/* ============ PRODUCTION APP ============ */
const { useState: useStateProd } = React;

function ProdApp() {
  const [tab, setTab] = useStateProd("Día");

  return (
    <div className="app-shell">

      {/* top nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div className="viewtabs" style={{ margin: 0 }}>
          <div className="seg">
            {["Día", "Mes", "Temporada", "Consultar", "Bart"].map(t => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="eyebrow" style={{ color: "var(--ink-2)", letterSpacing: ".04em" }}>
            01 Jan 2025 — 19 Jan 2025
          </span>
          <div className="select" style={{ minWidth: 90 }}>
            <select>
              <option>Todas</option>
              <option>Día</option>
              <option>Semana</option>
            </select>
          </div>
          <button className="btn btn-green" style={{ fontSize: 12 }}>Actualizar mq.</button>
        </div>
      </div>

      <ResumenSuperior />
      <CalibradorSection />
      <EnsacadoSection />

      <ProcesoDivider label="LÍNEA DE PROCESO PARTIDO" />

      <PartidoSection />
      <SeleccionSection />
      <ConsolidadoSection />

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProdApp />);
