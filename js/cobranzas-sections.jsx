/* ============ COBRANZAS · SECTIONS ============ */
const { useState: useStateCob } = React;

/* ---- top filter bar (6 filtros) ---- */
function CobranzasFilters({ temporada, setTemporada, rango, setRango, clientes, setClientes, mercados, setMercados, estado, setEstado, moneda, setMoneda }) {
  return (
    <div className="card filters-comex">
      <div className="filter">
        <label>Temporada</label>
        <div className="select"><select value={temporada} onChange={e => setTemporada(e.target.value)}>
          {TEMPORADAS_COB.map(t => <option key={t} value={t}>{t}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Rango vencimiento</label>
        <div className="select"><select value={rango} onChange={e => setRango(e.target.value)}>
          {RANGOS_VENCIMIENTO_COB.map(r => <option key={r} value={r}>{r}</option>)}
        </select></div>
      </div>
      <MultiSel label="Cliente" options={CLIENTES_COB} selected={clientes} onChange={setClientes} />
      <MultiSel label="Mercado" options={MERCADOS_COB} selected={mercados} onChange={setMercados} />
      <div className="filter">
        <label>Estado cobranza</label>
        <div className="select"><select value={estado} onChange={e => setEstado(e.target.value)}>
          {ESTADOS_COBRANZA_COB.map(e => <option key={e} value={e}>{e}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Moneda</label>
        <div className="select"><select value={moneda} onChange={e => setMoneda(e.target.value)}>
          {MONEDAS_COB.map(m => <option key={m} value={m}>{m}</option>)}
        </select></div>
      </div>
    </div>
  );
}

function AvisoEjemplo() {
  return (
    <div className="hint" style={{ background: "#fdf3e3", border: "1px solid #f0d9a8", borderRadius: 10, padding: "12px 16px", marginBottom: 18, color: "#8a6415" }}>
      ⚠ Vista con montos de ejemplo. La planilla actual no consolida pagos, saldos ni condiciones de pago; esta vista se activará cuando el módulo de cobranzas entregue datos reales.
    </div>
  );
}

/* ---- 1. Saldo pendiente total ---- */
function SaldoTotalCard({ data }) {
  const pctVencido = data.total ? data.vencido / data.total * 100 : 0;
  return (
    <InfoCard title="Saldo pendiente total" tag="actual">
      <div style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)" }}>{fmtUsdFull(data.total)}</div>
      <div className="flujo-bar" style={{ marginTop: 12 }}><span style={{ width: pctVencido + "%", background: "#c0392b" }}></span></div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Facturas abiertas</td><td className="num"><span className="cellnum">{data.facturas}</span></td></tr>
          <tr><td>No vencido</td><td className="num"><span className="cellnum" style={{ color: "var(--green-text)" }}>{fmtUsdFull(data.noVencido)}</span></td></tr>
          <tr><td>Vencido</td><td className="num"><span className="cellnum" style={{ color: "#c0392b" }}>{fmtUsdFull(data.vencido)}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 2. Vencido ---- */
function VencidoCard({ data }) {
  return (
    <InfoCard title="Vencido" tag="urgente" sub={data.facturas + " facturas vencidas"}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#c0392b" }}>{fmtUsdFull(data.total)}</div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Participación del saldo abierto</td><td className="num"><span className="cellnum">{data.participacion.toFixed(1).replace(".", ",")}%</span></td></tr>
          <tr><td>Mayor tramo de antigüedad</td><td className="num"><span className="cellnum">{data.mayorTramo}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 3. Por vencer ---- */
function PorVencerCard({ data }) {
  return (
    <InfoCard title="Por vencer" tag="próximos 7 días" sub={data.facturas + " facturas por vencer"}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "var(--orange)" }}>{fmtUsdFull(data.total)}</div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Participación del saldo abierto</td><td className="num"><span className="cellnum">{data.participacion.toFixed(1).replace(".", ",")}%</span></td></tr>
          <tr><td>Ventana de gestión</td><td className="num"><span className="cellnum">{data.ventana}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 4. Recibido mes ---- */
function RecibidoMesCard({ data }) {
  return (
    <InfoCard title="Recibido mes" tag="julio" sub={data.pagos + " pagos registrados"}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#2e5db3" }}>{fmtUsdFull(data.total)}</div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Pago promedio</td><td className="num"><span className="cellnum">{fmtUsdFull(data.promedio)}</span></td></tr>
          <tr><td>Moneda</td><td className="num"><span className="cellnum">{data.moneda}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 5. Antigüedad de saldos ---- */
function AntiguedadSaldos({ rows }) {
  const totalVencido = rows.filter(r => r.tramo !== "No vencido").reduce((s, r) => s + r.monto, 0);
  const max = Math.max(...rows.map(r => r.monto));
  return (
    <InfoCard title="Antigüedad de saldos" tag="aging" sub="Clasificación por días de vencimiento para priorizar la gestión.">
      {rows.map(r => (
        <div key={r.tramo} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.tramo}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{fmtUsdFull(r.monto)}  {r.pct}%</span>
          </div>
          <div style={{ height: 8, background: "#eef0f2", borderRadius: 4, overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: (r.monto / max * 100) + "%", background: r.tramo === "No vencido" ? "var(--green)" : "var(--orange)", borderRadius: 4 }}></span>
          </div>
        </div>
      ))}
      <div className="mini-sub" style={{ marginTop: 6 }}>Total vencido <b style={{ color: "#c0392b" }}>{fmtUsdFull(totalVencido)}</b></div>
    </InfoCard>
  );
}

/* ---- 6. Top clientes pendientes ---- */
function TopClientesPendientes({ rows }) {
  return (
    <InfoCard title="Top clientes pendientes" tag="saldo abierto" sub="Ranking por saldo abierto. Click en un cliente abre su detalle.">
      {rows.map(r => (
        <div key={r.cliente} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{r.cliente}</div>
            <div className="mini-sub" style={{ marginTop: 2 }}>{r.mercado} · {r.embarques} embarque{r.embarques !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{(r.saldo / 1000).toFixed(0)}K</div>
            <span className={"tag " + (r.badgeTone === "danger" ? "tag-danger" : "tag-rest")} style={{ marginTop: 3, display: "inline-block" }}>{r.badge}</span>
          </div>
        </div>
      ))}
    </InfoCard>
  );
}

/* ---- 7. Línea Coface ---- */
function LineaCoface({ rows }) {
  const color = pct => pct < 10 ? "#c0392b" : pct < 25 ? "var(--orange)" : "var(--green)";
  const sinMargen = rows.filter(r => r.pctLibre < 10).length;
  return (
    <InfoCard title="Línea Coface" tag="seguro de crédito" sub="Ordenado desde la línea más apretada. Click en un cliente abre su historial de cobertura.">
      <table className="t">
        <thead><tr><th>Cliente</th><th className="num">Aprobada</th><th className="num">Usada</th><th className="num">Libre</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.cliente}>
              <td className="var">{r.cliente}</td>
              <td className="num">{fmtUsdFull(r.aprobada)}</td>
              <td className="num">{fmtUsdFull(r.usada)}</td>
              <td className="num"><span className="cellnum">{fmtUsdFull(r.libre)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        {rows.map(r => (
          <div key={r.cliente} style={{ height: 5, background: "#eef0f2", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
            <span style={{ display: "block", height: "100%", width: r.pctLibre + "%", background: color(r.pctLibre), borderRadius: 3 }}></span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "#c0392b" }}></span>&lt;10% libre</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--orange)" }}></span>10-25%</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--green)" }}></span>&gt;25%</span>
      </div>
      <div className="mini-sub" style={{ marginTop: 8 }}>{sinMargen} clientes sin margen para nuevos embarques</div>
    </InfoCard>
  );
}

/* ---- Grilla de cobranzas ---- */
function docChip(estado) {
  const cls = estado === "Aprobados" ? "tag-done" : estado === "Enviados" ? "tag-comp" : estado === "Falta BL" ? "tag-danger" : "tag-rest";
  return <span className={"tag " + cls}>{estado}</span>;
}

function GrillaCobranzas({ rows }) {
  const [vista, setVista] = useStateCob("Pendientes");
  const filtradas = vista === "Todos" ? rows
    : vista === "Vencidos" ? rows.filter(r => r.urgencia.startsWith("+") || r.urgencia === "Hoy")
    : vista === "Por vencer" ? rows.filter(r => !r.urgencia.startsWith("+") && r.urgencia !== "Hoy")
    : vista === "Pagados" ? rows.filter(r => r.saldo === 0)
    : rows.filter(r => r.saldo > 0);

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 className="section-title" style={{ fontSize: 15 }}>Grilla de cobranzas</h3>
          <div className="mini-sub" style={{ marginTop: 4 }}>Ordenados por urgencia de gestión, de mayor a menor. Click en una fila abre el detalle de la factura y del embarque.</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-ghost">Ver detalle</button>
          <button className="btn btn-green">{Icon.save}Exportar</button>
        </div>
      </div>
      <div className="viewtabs" style={{ justifyContent: "flex-start", margin: "14px 0" }}>
        <div className="seg">
          {ESTADOS_COBRANZA_COB.map(v => (
            <button key={v} className={vista === v ? "active" : ""} onClick={() => setVista(v)}>{v}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="big">
          <thead>
            <tr>
              <th>Vence</th><th>Urgencia</th><th>Cliente</th><th>Embarque</th><th>Factura</th>
              <th className="num">Monto</th><th className="num">Pagado</th><th className="num" style={{ paddingRight: 16 }}>Saldo</th>
              <th>Condición</th><th>Documentos</th><th>Estado embarque</th><th>Próxima acción</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(r => {
              const vencido = r.urgencia.startsWith("+") || r.urgencia === "Hoy";
              return (
                <tr key={r.embarque + r.factura}>
                  <td>{r.vence}</td>
                  <td style={{ color: vencido ? "#c0392b" : "var(--orange)", fontWeight: 700 }}>{r.urgencia}</td>
                  <td className="strong">{r.cliente}</td>
                  <td>{r.embarque}</td>
                  <td>{r.factura}</td>
                  <td className="num">{fmtUsdFull(r.monto)}</td>
                  <td className="num">{fmtUsdFull(r.pagado)}</td>
                  <td className="num" style={{ paddingRight: 16 }}><span className="cellnum">{fmtUsdFull(r.saldo)}</span></td>
                  <td>{r.condicion}</td>
                  <td>{docChip(r.documentos)}</td>
                  <td>{r.estadoEmbarque}</td>
                  <td style={{ color: "var(--muted)" }}>{r.accion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "#c0392b" }}></span>Vencido</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--orange)" }}></span>Por vencer</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--green)" }}></span>Documentos OK</span>
      </div>
      <div className="mini-sub" style={{ marginTop: 8 }}>Mostrando {filtradas.length} de 42 facturas · montos de ejemplo</div>
    </div>
  );
}

function CobranzasFooter() {
  return (
    <div className="mini-sub" style={{ textAlign: "center", marginTop: 8, marginBottom: 30 }}>
      Vista · Cobranzas · Valbifrut · vista de referencia con datos de ejemplo · 29-jul-2026
    </div>
  );
}

Object.assign(window, {
  CobranzasFilters, AvisoEjemplo, SaldoTotalCard, VencidoCard, PorVencerCard, RecibidoMesCard,
  AntiguedadSaldos, TopClientesPendientes, LineaCoface, docChip, GrillaCobranzas, CobranzasFooter,
});
