/* ============ TOP SECTION — three tables replacing summary cards ============ */

function MiniTable({ title, sub, tagClass, tagText, rows, totalLabel, unit, onEdit }) {
  return (
    <div className="card card-pad">
      <div className="mini-head">
        <div>
          <h3 className="mini-title">{title}</h3>
          <div className="mini-sub">{sub}</div>
        </div>
        {onEdit
          ? <button className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: 11.5 }} onClick={onEdit}>{Icon.edit}Editar</button>
          : <span className={"tag " + tagClass}>{tagText}</span>}
      </div>
      <table className="t">
        <thead>
          <tr>
            <th>Variedad</th>
            <th className="num">{unit === "kg" ? "KG" : unit === "usd" ? "USD" : "% del total"}</th>
            {rows[0].aux !== undefined && <th className="num">{rows[0].auxLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className={r.total ? "total" : ""}>
              <td className="var">{r.name}</td>
              <td className="num"><span className="cellnum">{r.value}</span></td>
              {r.aux !== undefined && <td className="num"><span className={"cellnum " + (r.auxClass || "")}>{r.aux}</span></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopSection({ presupVar, procesado, unit, setUnit, onEditBudget }) {
  // presupVar: { key: kg } totals per variety
  const totalPres = VARIEDADES.reduce((s, v) => s + presupVar[v.key], 0);
  const totalProc = VARIEDADES.reduce((s, v) => s + procesado[v.key], 0);
  const totalRest = totalPres - totalProc;

  const presRows = VARIEDADES.map(v => ({
    name: v.name,
    value: fmtUnit(presupVar[v.key], v.precio, unit, totalPres),
  }));
  presRows.push({ name: "Total", value: fmtUnit(totalPres, avgPrice(presupVar), unit, totalPres), total: true });

  const procRows = VARIEDADES.map(v => {
    const av = presupVar[v.key] ? (procesado[v.key] / presupVar[v.key]) * 100 : 0;
    return {
      name: v.name,
      value: fmtUnit(procesado[v.key], v.precio, unit, totalProc),
      aux: fmtPct(av), auxLabel: "Avance", auxClass: "pos",
    };
  });
  procRows.push({ name: "Total", total: true,
    value: fmtUnit(totalProc, avgPrice(procesado), unit, totalProc),
    aux: fmtPct(totalPres ? (totalProc / totalPres) * 100 : 0), auxClass: "pos" });

  const restRows = VARIEDADES.map(v => {
    const rest = presupVar[v.key] - procesado[v.key];
    const pend = presupVar[v.key] ? (rest / presupVar[v.key]) * 100 : 0;
    return {
      name: v.name,
      value: fmtUnit(rest, v.precio, unit, totalRest),
      aux: fmtPct(pend), auxLabel: "Pendiente", auxClass: "neg",
    };
  });
  restRows.push({ name: "Total", total: true,
    value: fmtUnit(totalRest, avgPrice({chandler:presupVar.chandler-procesado.chandler,howard:presupVar.howard-procesado.howard,serr:presupVar.serr-procesado.serr,tulare:presupVar.tulare-procesado.tulare}), unit, totalRest),
    aux: fmtPct(totalPres ? (totalRest / totalPres) * 100 : 0), auxClass: "neg" });

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
        <div>
          <h2 className="section-title">Recepción de Fruta por Variedad</h2>
          <div className="mini-sub" style={{ marginTop: 3 }}>Presupuesto, procesado y stock por procesar · Temporada 2023/24</div>
        </div>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>
      <div className="tri-grid">
        <MiniTable title="Presupuesto" sub="Lo que se pretende"
          rows={presRows} unit={unit} onEdit={onEditBudget} />
        <MiniTable title="Procesado" sub="Lo que se ha hecho"
          tagClass="tag-done" tagText="Real" rows={procRows} unit={unit} />
        <MiniTable title="Stock por Procesar" sub="Lo que queda por hacer"
          tagClass="tag-rest" tagText="Pendiente" rows={restRows} unit={unit} />
      </div>
    </div>
  );
}

function avgPrice(kgByVar) {
  let kg = 0, usd = 0;
  VARIEDADES.forEach(v => { const q = kgByVar[v.key] || 0; kg += q; usd += q * v.precio; });
  return kg ? usd / kg : 0;
}

Object.assign(window, { TopSection, MiniTable, avgPrice });
