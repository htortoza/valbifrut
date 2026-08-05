/* ============ COMEX APP ============ */
const { useState: useStateComexApp } = React;

function ComexApp() {
  const [temporada, setTemporada] = useStateComexApp(TEMPORADAS_COMEX[0]);
  const [mesOperativo, setMesOperativo] = useStateComexApp("Julio 2026");
  const [semanaRango, setSemanaRango] = useStateComexApp(SEMANA_RANGOS_COMEX[1]);
  const [clientes, setClientes] = useStateComexApp([]);
  const [prodvar, setProdvar] = useStateComexApp([]);
  const [estado, setEstado] = useStateComexApp("Todos");

  const rows = GRILLA_PLANIFICACION_COMEX.filter(r => {
    if (clientes.length && !clientes.includes(r.cliente)) return false;
    if (prodvar.length && !prodvar.includes(r.producto) && !prodvar.includes(r.variedad)) return false;
    if (estado !== "Todos" && r.estado !== estado) return false;
    return true;
  });

  return (
    <div className="app-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 22 }}>Planificación y Comex</h1>
          <div className="mini-sub" style={{ marginTop: 4 }}>Vista operativa mensual · compromisos, capacidad, planificación, producción y calendario de cargas</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-deep)" }}>Valbifrut</div>
      </div>

      <ComexFilters
        temporada={temporada} setTemporada={setTemporada}
        mesOperativo={mesOperativo} setMesOperativo={setMesOperativo}
        semanaRango={semanaRango} setSemanaRango={setSemanaRango}
        clientes={clientes} setClientes={setClientes}
        prodvar={prodvar} setProdvar={setProdvar}
        estado={estado} setEstado={setEstado}
      />

      <SectionEyebrow>Planificación · tarjetas operativas</SectionEyebrow>
      <div className="quad-grid" style={{ marginBottom: 16 }}>
        <EmbarquesCard data={EMBARQUES_COMPROMETIDOS_COMEX} />
        <CapacidadCard data={CAPACIDAD_PLANTA_COMEX} />
        <DocumentosCard data={DOCUMENTOS_EMBARQUE_COMEX} />
        <NavesCard data={NAVES_PROXIMAS_COMEX} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <DespachosChart data={DESPACHOS_SEMANA_COMEX} />
        <StackingTable rows={STACKING_DESTINOS_COMEX} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <PlanificacionGrid rows={rows} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <PlanificacionCalendar rows={rows} />
      </div>

      <ComexFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ComexApp />);
