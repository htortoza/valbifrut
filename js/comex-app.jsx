/* ============ COMEX APP ============ */
const { useState: useStateComexApp } = React;

function ComexApp() {
  const [temporada, setTemporada] = useStateComexApp(TEMPORADAS_COMEX[0]);
  const [semana, setSemana] = useStateComexApp(SEMANA_ACTUAL_COMEX);
  const [clientes, setClientes] = useStateComexApp([]);
  const [prodvar, setProdvar] = useStateComexApp([]);

  const rows = GRILLA_PLANIFICACION_COMEX.filter(r => {
    if (clientes.length && !clientes.includes(r.cliente)) return false;
    if (prodvar.length && !prodvar.includes(r.producto) && !prodvar.includes(r.variedad)) return false;
    return true;
  });

  const semanaInfo = SEMANAS_COMEX.find(s => s.n === semana);

  return (
    <div className="app-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 22 }}>Planificación y Comex</h1>
          <div className="mini-sub" style={{ marginTop: 4 }}>Vista operativa semanal · compromisos, capacidad, planificación y calendario de cargas</div>
        </div>
        <div className="logo-mark" style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-deep)" }}>Valbifrut</div>
      </div>

      <ComexFilters
        temporada={temporada} setTemporada={setTemporada}
        semana={semana} setSemana={setSemana}
        clientes={clientes} setClientes={setClientes}
        prodvar={prodvar} setProdvar={setProdvar}
      />

      <div className="quad-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <EmbarquesCard data={embarquesComprometidos(rows)} />
        <CapacidadCard data={CAPACIDAD_PLANTA_COMEX} semanaLabel={semanaInfo ? semanaInfo.label : ""} />
      </div>

      <div className="grid-comex-34" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <DespachosChart data={DESPACHOS_SEMANA_COMEX} />
        <StackingTable rows={STACKING_DESTINOS_COMEX} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <PlanificacionGrid rows={rows} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <PlanificacionCalendar rows={rows} semanaActual={semana} />
      </div>

      <ComexFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ComexApp />);
