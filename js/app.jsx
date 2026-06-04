/* ============ MAIN APP ============ */

const DEFAULT_MATRIX = {
  chandler: { Alemania: 160000, Brasil: 120000, Corea: 60000, Italia: 40000 },
  howard:   { Alemania: 90000,  Brasil: 70000,  Corea: 50000, Italia: 30000 },
  serr:     { Alemania: 60000,  Brasil: 40000,  Corea: 30000, Italia: 20000 },
  tulare:   { Alemania: 30000,  Brasil: 25000,  Corea: 15000, Italia: 10000 },
};

const LS = {
  budget: "valbifrut.presupuesto",
  budgetTs: "valbifrut.presupuesto.ts",
  calidad: "valbifrut.calidad",
  calidadTs: "valbifrut.calidad.ts",
  cortes: "valbifrut.cortes",
  cortesTs: "valbifrut.cortes.ts",
};

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function nowStamp() {
  return new Date().toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function App() {
  // view + unit
  const [view, setView] = useState("graficos");
  const [unit, setUnit] = useState("kg");

  // filters
  const [fTipo, setFTipo] = useState("NCC/NSC");
  const [fVariedad, setFVariedad] = useState("Todas");
  const [fTemporada, setFTemporada] = useState("2023/24");
  const [fDestino, setFDestino] = useState("Todos");
  const [fCalidadF, setFCalidadF] = useState("Todas");
  const [fEnvase, setFEnvase] = useState("Saco 25kg");

  // persisted data
  const [matrix, setMatrix] = useState(() => loadLS(LS.budget, DEFAULT_MATRIX));
  const [budgetTs, setBudgetTs] = useState(() => loadLS(LS.budgetTs, null));
  const [calidad, setCalidad] = useState(() => loadLS(LS.calidad, CALIDAD_PARAMS_DEFAULT));
  const [calidadTs, setCalidadTs] = useState(() => loadLS(LS.calidadTs, null));
  const [cortes, setCortes] = useState(() => loadLS(LS.cortes, CORTES_DEFAULT));
  const [cortesTs, setCortesTs] = useState(() => loadLS(LS.cortesTs, null));

  // modals
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  // budget totals per variety (respecting destino filter)
  const presupVar = {};
  VARIEDADES.forEach(v => {
    if (fDestino === "Todos") {
      presupVar[v.key] = DEST_BUDGET.reduce((s, d) => s + (matrix[v.key]?.[d] || 0), 0);
    } else {
      presupVar[v.key] = matrix[v.key]?.[fDestino] || 0;
    }
  });
  // processed scaled to destino filter share (proportional demo)
  const procesado = {};
  VARIEDADES.forEach(v => {
    const full = DEST_BUDGET.reduce((s, d) => s + (matrix[v.key]?.[d] || 0), 0);
    const share = full ? presupVar[v.key] / full : 1;
    procesado[v.key] = Math.round(PROCESADO[v.key] * share);
  });

  const totalProcKg = VARIEDADES.reduce((s, v) => s + procesado[v.key], 0);

  function saveBudget(m) {
    const ts = nowStamp();
    setMatrix(m); setBudgetTs(ts);
    localStorage.setItem(LS.budget, JSON.stringify(m));
    localStorage.setItem(LS.budgetTs, JSON.stringify(ts));
    setModal(null); flash("Presupuesto guardado correctamente");
  }
  function saveCalidad(rows) {
    const ts = nowStamp();
    setCalidad(rows); setCalidadTs(ts);
    localStorage.setItem(LS.calidad, JSON.stringify(rows));
    localStorage.setItem(LS.calidadTs, JSON.stringify(ts));
    setModal(null); flash("Parámetros de calidad guardados");
  }
  function saveCortes(rows) {
    const ts = nowStamp();
    setCortes(rows); setCortesTs(ts);
    localStorage.setItem(LS.cortes, JSON.stringify(rows));
    localStorage.setItem(LS.cortesTs, JSON.stringify(ts));
    setModal(null); flash("Cortes del partido mecánico guardados");
  }

  return (
    <div className="app-shell">
      {/* view tabs */}
      <div className="viewtabs">
        <div className="seg">
          <button className={view === "graficos" ? "active" : ""} onClick={() => setView("graficos")}>Vista Gráficos</button>
          <button className={view === "tablas" ? "active" : ""} onClick={() => setView("tablas")}>Vista Tablas</button>
        </div>
      </div>

      {/* filters */}
      <div className="card filters">
        <Sel label="Tipo Producto" value={fTipo} options={["NCC/NSC","NCC","NSC"]} onChange={setFTipo} />
        <Sel label="Variedad" value={fVariedad} options={VARIEDADES_FILTRO} onChange={setFVariedad} />
        <Sel label="Calidad" value={fCalidadF} options={CALIDADES} onChange={setFCalidadF} />
        <Sel label="Destino" value={fDestino} options={DESTINOS} onChange={setFDestino} />
        <Sel label="Temporada" value={fTemporada} options={["2023/24","2022/23","2021/22"]} onChange={setFTemporada} />
        <Sel label="Cliente" value="Todos" options={["Todos","Directo","Mayorista"]} onChange={() => {}} />
        <Sel label="Envase" value={fEnvase} options={["Saco 25kg","Caja 10kg","Granel"]} onChange={setFEnvase} />
        <Sel label="Broker" value="Directo" options={["Directo","Broker A","Broker B"]} onChange={() => {}} />
      </div>

      {/* management tools */}
      <div className="tool-row">
        <button className="btn btn-ghost" onClick={() => setModal("calidad")}>{Icon.sliders}Parámetros de Calidad
          {calidadTs && <span style={{ color: "var(--green-text)", marginLeft: 2 }}>•</span>}</button>
        <button className="btn btn-ghost" onClick={() => setModal("cortes")}>{Icon.scissors}Cortes del Partido Mecánico
          {cortesTs && <span style={{ color: "var(--green-text)", marginLeft: 2 }}>•</span>}</button>
      </div>

      {/* TOP: three tables */}
      <TopSection presupVar={presupVar} procesado={procesado} unit={unit} setUnit={setUnit}
        onEditBudget={() => setModal("budget")} />

      {/* NUEVA SECCIÓN: desglose por producto + calculadora */}
      <DesgloseProducto calidad={fCalidadF} variedad={fVariedad} />

      {/* middle: flujo + sales chart */}
      <div className="grid-mid" style={{ marginBottom: 16 }}>
        <FlujoStock />
        <SalesChart />
      </div>

      {/* donuts + line chart */}
      <div className="grid-mid-2" style={{ marginBottom: 16 }}>
        <div className="stack">
          <CuotaCard />
          <DesgloseCard />
        </div>
        <VolPaises />
      </div>

      {/* mercado */}
      <MercadoTable unit={unit} />

      {/* panorama */}
      <Panorama />

      {/* modals */}
      {modal === "budget" && (
        <BudgetModal matrix={matrix} lastSaved={budgetTs} onSave={saveBudget} onClose={() => setModal(null)} />
      )}
      {modal === "calidad" && (
        <CalidadModal params={calidad} lastSaved={calidadTs} onSave={saveCalidad} onClose={() => setModal(null)} />
      )}
      {modal === "cortes" && (
        <CortesModal cortes={cortes} baseKg={totalProcKg} lastSaved={cortesTs} onSave={saveCortes} onClose={() => setModal(null)} />
      )}

      {/* toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "var(--dark)", color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, boxShadow: "0 12px 34px rgba(10,15,20,.34)", zIndex: 200 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
