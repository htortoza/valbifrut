/* ============ COMEX · APP PRINCIPAL (une las 4 secciones en una sola pantalla) ============ */
const { useState: useStateComexMain } = React;

const COMEX_TABS = [
  { key: "novedades",     label: "Novedades Comerciales" },
  { key: "planificacion", label: "Planificación" },
  { key: "cobranzas",     label: "Cobranzas" },
  { key: "embarques",     label: "Embarques" },
];

function ComexApp() {
  const [tab, setTab] = useStateComexMain("novedades");

  return (
    <div className="app-shell" style={{ maxWidth: 1280 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 22 }}>Comex</h1>
          <div className="mini-sub" style={{ marginTop: 4 }}>Novedades comerciales, planificación, cobranzas y embarques · Valbifrut</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-deep)" }}>Valbifrut</div>
      </div>

      <div className="viewtabs">
        <div className="seg">
          {COMEX_TABS.map(t => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === "novedades" && <NovedadesSection />}
      {tab === "planificacion" && <PlanificacionSection />}
      {tab === "cobranzas" && <CobranzasSection />}
      {tab === "embarques" && <EmbarquesSection />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ComexApp />);
