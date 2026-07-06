/* ============ TOP SECTION — 4 metric cards ============ */

function MetricCard({ title, tagClass, tagText, data, onEdit }) {
  const fmt = n => Math.round(n).toLocaleString("en-US");
  const { chandlerNcc, chandlerNsc, serrNcc, serrNsc } = data;
  const totalNcc = chandlerNcc + serrNcc;
  const totalNsc = chandlerNsc + serrNsc;

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
          <tr>
            <th>Variedad</th>
            <th className="num">NCC</th>
            <th className="num">NSC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="var">Chandler</td>
            <td className="num"><span className="cellnum">{fmt(chandlerNcc)}</span></td>
            <td className="num"><span className="cellnum">{fmt(chandlerNsc)}</span></td>
          </tr>
          <tr>
            <td className="var">Serr</td>
            <td className="num"><span className="cellnum">{fmt(serrNcc)}</span></td>
            <td className="num"><span className="cellnum">{fmt(serrNsc)}</span></td>
          </tr>
          <tr className="total">
            <td className="var">Total</td>
            <td className="num"><span className="cellnum">{fmt(totalNcc)}</span></td>
            <td className="num"><span className="cellnum">{fmt(totalNsc)}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TopSection({ presupVar, unit, setUnit, onEditBudget }) {
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
        <MetricCard title="Presupuesto" tagClass="tag-plan" tagText="Plan"
          data={METRICAS.presupuesto} onEdit={onEditBudget} />
        <MetricCard title="Despachado" tagClass="tag-done" tagText="Real"
          data={METRICAS.despachado} />
        <MetricCard title="Comprometido" tagClass="tag-comp" tagText="Firmado"
          data={METRICAS.comprometido} />
        <MetricCard title="Por Vender" tagClass="tag-rest" tagText="Pendiente"
          data={METRICAS.porVender} />
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
