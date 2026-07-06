/* ============ TOP SECTION — 4 metric cards ============ */

function MetricCard({ title, tagClass, tagText, chandler, serr, ncc, nsc, onEdit }) {
  const totalVar  = chandler + serr;
  const totalTipo = ncc + nsc;
  const fmt = n => Math.round(n).toLocaleString("en-US");

  return (
    <div className="card card-pad">
      <div className="mini-head">
        <h3 className="mini-title">{title}</h3>
        {onEdit
          ? <button className="btn btn-ghost" style={{ padding: "5px 9px", fontSize: 11 }} onClick={onEdit}>{Icon.edit}Editar</button>
          : <span className={"tag " + tagClass}>{tagText}</span>}
      </div>
      <table className="t">
        <thead>
          <tr><th>Detalle</th><th className="num">KG</th></tr>
        </thead>
        <tbody>
          <tr className="grp-metric"><td colSpan={2}>Por variedad</td></tr>
          <tr><td className="var">Chandler</td><td className="num"><span className="cellnum">{fmt(chandler)}</span></td></tr>
          <tr><td className="var">Serr</td><td className="num"><span className="cellnum">{fmt(serr)}</span></td></tr>
          <tr><td className="var" style={{ color: "var(--muted)" }}>Subtotal</td><td className="num"><span className="cellnum" style={{ color: "var(--muted)" }}>{fmt(totalVar)}</span></td></tr>
          <tr className="grp-metric"><td colSpan={2}>Por tipo</td></tr>
          <tr><td className="var">NCC</td><td className="num"><span className="cellnum">{fmt(ncc)}</span></td></tr>
          <tr><td className="var">NSC</td><td className="num"><span className="cellnum">{fmt(nsc)}</span></td></tr>
          <tr className="total"><td className="var">Total</td><td className="num"><span className="cellnum">{fmt(totalTipo)}</span></td></tr>
        </tbody>
      </table>
    </div>
  );
}

function TopSection({ presupVar, unit, setUnit, onEditBudget }) {
  const chandlerPres = presupVar.chandler || 0;
  const serrPres     = presupVar.serr     || 0;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
        <div>
          <h2 className="section-title">Recepción de Fruta por Variedad</h2>
          <div className="mini-sub" style={{ marginTop: 3 }}>Presupuesto, despachado, comprometido y por vender · Temporada 2023/24</div>
        </div>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>
      <div className="quad-grid">
        <MetricCard
          title="Presupuesto" tagClass="tag-plan" tagText="Plan"
          chandler={chandlerPres} serr={serrPres}
          ncc={METRICAS_TIPO.presupuesto.ncc} nsc={METRICAS_TIPO.presupuesto.nsc}
          onEdit={onEditBudget}
        />
        <MetricCard
          title="Despachado" tagClass="tag-done" tagText="Real"
          chandler={METRICAS_VARIEDAD.despachado.chandler} serr={METRICAS_VARIEDAD.despachado.serr}
          ncc={METRICAS_TIPO.despachado.ncc} nsc={METRICAS_TIPO.despachado.nsc}
        />
        <MetricCard
          title="Comprometido" tagClass="tag-comp" tagText="Firmado"
          chandler={METRICAS_VARIEDAD.comprometido.chandler} serr={METRICAS_VARIEDAD.comprometido.serr}
          ncc={METRICAS_TIPO.comprometido.ncc} nsc={METRICAS_TIPO.comprometido.nsc}
        />
        <MetricCard
          title="Por Vender" tagClass="tag-rest" tagText="Pendiente"
          chandler={METRICAS_VARIEDAD.porVender.chandler} serr={METRICAS_VARIEDAD.porVender.serr}
          ncc={METRICAS_TIPO.porVender.ncc} nsc={METRICAS_TIPO.porVender.nsc}
        />
      </div>
    </div>
  );
}

function avgPrice(kgByVar) {
  let kg = 0, usd = 0;
  VARIEDADES.forEach(v => { const q = kgByVar[v.key] || 0; kg += q; usd += q * v.precio; });
  return kg ? usd / kg : 0;
}

Object.assign(window, { TopSection, MetricCard, avgPrice });
