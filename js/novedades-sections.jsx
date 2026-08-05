/* ============ NOVEDADES COMERCIALES · SECTIONS ============ */
const { useState: useStateNov } = React;

/* ---- top filter bar (5 filtros) ---- */
function NovedadesFilters({ temporada, setTemporada, rango, setRango, clientes, setClientes, mercados, setMercados, prodvar, setProdvar }) {
  return (
    <div className="card filters-comex" style={{ gridTemplateColumns: "0.8fr 1fr 1.1fr 1.1fr 1.1fr" }}>
      <div className="filter">
        <label>Temporada</label>
        <div className="select"><select value={temporada} onChange={e => setTemporada(e.target.value)}>
          {TEMPORADAS_NOV.map(t => <option key={t} value={t}>{t}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Rango novedades</label>
        <div className="select"><select value={rango} onChange={e => setRango(e.target.value)}>
          {RANGOS_NOV.map(r => <option key={r} value={r}>{r}</option>)}
        </select></div>
      </div>
      <MultiSel label="Cliente" options={CLIENTES_NOV} selected={clientes} onChange={setClientes} />
      <MultiSel label="Mercado" options={MERCADOS_NOV} selected={mercados} onChange={setMercados} />
      <MultiSel label="Producto / Variedad" options={PRODVAR_OPCIONES_NOV} selected={prodvar} onChange={setProdvar} />
    </div>
  );
}

/* ---- 1. Nuevos contratos ---- */
function ContratosCard({ rows }) {
  return (
    <InfoCard title="Nuevos contratos" tag="últimos 7 días" sub="Contratos suscritos entre el 22 y el 28 de julio.">
      <table className="t">
        <thead><tr><th>N° contrato</th><th>Cliente</th><th className="num">Kg</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.contrato}>
              <td className="var">{r.contrato}</td>
              <td>{r.cliente}</td>
              <td className="num"><span className="cellnum">{r.kg.toLocaleString("en-US")}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mini-sub" style={{ marginTop: 12, color: "var(--green-text)", fontWeight: 600 }}>Ver detalle de contratos →</div>
    </InfoCard>
  );
}

/* ---- 2. Estadísticas de kilos · temporada ---- */
function KilosTemporadaCard({ rows, avance }) {
  return (
    <InfoCard title="Estadísticas de kilos · temporada" tag="cerrado vs despacho" sub="Kilos comprometidos por contrato, despachados y saldo por despachar.">
      <table className="t">
        <thead><tr><th>Tipo</th><th className="num">Comprometidos</th><th className="num">Despachados</th><th className="num">Por despachar</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.tipo}>
              <td><span className="chip" style={r.tipo === "EQQCC" ? { background: "#faf1de", borderColor: "#ecdfb8", color: "#9a6b1f" } : {}}>{r.tipo}</span></td>
              <td className="num"><span className="cellnum">{r.comprometidos.toLocaleString("en-US")}</span></td>
              <td className="num"><span className="cellnum" style={{ color: "var(--green-text)" }}>{r.despachados.toLocaleString("en-US")}</span></td>
              <td className="num"><span className="cellnum" style={{ color: "var(--orange)" }}>{r.porDespachar.toLocaleString("en-US")}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flujo-bar" style={{ marginTop: 14 }}><span style={{ width: avance + "%" }}></span></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span className="eyebrow">Avance equivalente cáscara (EQQCC)</span>
        <span className="eyebrow" style={{ color: "var(--green-text)" }}>{String(avance).replace(".", ",")}%</span>
      </div>
    </InfoCard>
  );
}

/* ---- 3. % de venta ---- */
function VentaCard({ data }) {
  const { pctVenta, kgVendidos, objetivoKg, pctDespachadoDeVendido, kgDespachados, kgPorDespachar, pctEmbarquesDespachados } = data;
  return (
    <InfoCard title="% de venta" tag="EQQCC" sub="Venta cerrada vs objetivo de temporada">
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)" }}>{String(pctVenta).replace(".", ",")}%</div>
      <div className="flujo-bar" style={{ marginTop: 12 }}><span style={{ width: pctVenta + "%", background: "#2e5db3" }}></span></div>
      <div className="mini-sub" style={{ marginTop: 6 }}>{fmtKg(kgVendidos)} vendidos</div>
      <div className="mini-sub">Objetivo {fmtKg(objetivoKg)}</div>
      <div className="eyebrow" style={{ marginTop: 16 }}>Despachado de lo vendido {String(pctDespachadoDeVendido).replace(".", ",")}%</div>
      <div className="flujo-bar" style={{ marginTop: 8 }}><span style={{ width: pctDespachadoDeVendido + "%" }}></span></div>
      <div className="mini-sub" style={{ marginTop: 6 }}>{fmtKg(kgDespachados)} despachados</div>
      <div className="mini-sub">{fmtKg(kgPorDespachar)} por despachar</div>
      <div className="mini-sub" style={{ marginTop: 12 }}>{pctEmbarquesDespachados}% de los embarques despachados</div>
    </InfoCard>
  );
}

/* ---- 4. Embarques (resumen temporada) ---- */
function EmbarquesResumenCard({ data }) {
  const pct = data.total ? Math.round((data.despachados / data.total) * 100) : 0;
  return (
    <InfoCard title="Embarques" tag="temporada">
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)" }}>{data.total}</div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Despachados</td><td className="num"><span className="cellnum" style={{ color: "var(--green-text)" }}>{data.despachados}</span></td></tr>
          <tr><td>Por despachar</td><td className="num"><span className="cellnum" style={{ color: "var(--orange)" }}>{data.porDespachar}</span></td></tr>
        </tbody>
      </table>
      <div className="flujo-bar" style={{ marginTop: 12 }}><span style={{ width: pct + "%" }}></span></div>
    </InfoCard>
  );
}

/* ---- Top 5 mercados ---- */
function TopMercadosBar({ pais, kg, usd, maxKg, maxUsd, indicador }) {
  const showKg = indicador !== "US$";
  const showUsd = indicador !== "Kg";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{pais}</span>
        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
          {showKg && <b style={{ color: "var(--ink-2)" }}>{kg.toLocaleString("en-US")} kg</b>}
          {showKg && showUsd && "  ·  "}
          {showUsd && <span>US${usd.toFixed(2)}M</span>}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {showKg && <div style={{ height: 8, background: "#eef0f2", borderRadius: 4, overflow: "hidden" }}>
          <span style={{ display: "block", height: "100%", width: (kg / maxKg * 100) + "%", background: "var(--green)", borderRadius: 4 }}></span>
        </div>}
        {showUsd && <div style={{ height: 8, background: "#eef0f2", borderRadius: 4, overflow: "hidden" }}>
          <span style={{ display: "block", height: "100%", width: (usd / maxUsd * 100) + "%", background: "var(--green-light)", borderRadius: 4 }}></span>
        </div>}
      </div>
    </div>
  );
}

function TopMercados({ data, totalKg, totalUsd }) {
  const [tipo, setTipo] = useStateNov("Inshell");
  const [indicador, setIndicador] = useStateNov("Ambos");
  const maxKg = Math.max(...data.map(m => m.kg));
  const maxUsd = Math.max(...data.map(m => m.usd));
  return (
    <InfoCard title="Top 5 mercados" sub="Ranking por país destino. La visualización cambia según tipo de producto e indicador.">
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Tipo de producto</div>
          <SegToggle value={tipo} onChange={setTipo} options={[["Inshell", "Inshell"], ["Shelled", "Shelled"], ["EQQCC", "EQQCC"]]} />
          <div className="eyebrow" style={{ margin: "16px 0 8px" }}>Indicador</div>
          <SegToggle value={indicador} onChange={setIndicador} options={[["Kg", "Kg"], ["US$", "US$"], ["Ambos", "Ambos"]]} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)" }}>{totalKg.toLocaleString("en-US")}</div>
              <div className="eyebrow">Kg top 5</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)" }}>US${totalUsd.toFixed(2)}M</div>
              <div className="eyebrow">Facturado top 5</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginBottom: 10 }}>
            <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--green)" }}></span>Kg</span>
            <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--green-light)" }}></span>US$</span>
          </div>
          {data.map(m => <TopMercadosBar key={m.pais} pais={m.pais} kg={m.kg} usd={m.usd} maxKg={maxKg} maxUsd={maxUsd} indicador={indicador} />)}
          <div className="mini-sub">Indicador Ambos: barra sólida = kg comprometidos · barra clara = US$ facturado.</div>
        </div>
      </div>
    </InfoCard>
  );
}

/* ---- Últimos embarques despachados ---- */
function UltimosDespachados({ rows }) {
  const [rango, setRango] = useStateNov("7");
  const dias = { "7": 7, "14": 14, "30": 30, "todos": 99999 }[rango];
  const shown = rows.filter(r => r.diasAtras <= dias);
  const tieneRevisar = shown.some(r => r.estado === "Revisar");

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 className="section-title" style={{ fontSize: 15 }}>Últimos embarques despachados</h3>
          <div className="mini-sub" style={{ marginTop: 4 }}>Despacho real versus compromiso comercial de carga. Click en una fila abre el detalle del embarque.</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SegToggle value={rango} onChange={setRango} options={[["7", "7 días"], ["14", "14 días"], ["30", "1 mes"], ["todos", "Todos"]]} />
          <button className="btn btn-ghost">Ver detalle</button>
          <button className="btn btn-green">Actualizar</button>
        </div>
      </div>
      <div style={{ overflowX: "auto", marginTop: 14 }}>
        <table className="big">
          <thead>
            <tr>
              <th>Emb. (ref.)</th><th>Cliente</th><th>Producto</th><th>Semana despacho</th><th>Semana compromiso</th>
              <th className="num">Kg solicitados</th><th className="num">Kg despachados</th><th className="num" style={{ paddingRight: 16 }}>Dif.</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.emb}>
                <td className="strong">{r.emb}</td>
                <td>{r.cliente}</td>
                <td>{r.producto}</td>
                <td>{r.semDesp}</td>
                <td>{r.semComp}</td>
                <td className="num">{r.kgSol.toLocaleString("en-US")}</td>
                <td className="num">{r.kgDesp.toLocaleString("en-US")}</td>
                <td className="num" style={{ color: r.dif < 0 ? "var(--orange)" : "var(--muted)", paddingRight: 16 }}>{r.dif.toLocaleString("en-US")}</td>
                <td><span className={"tag " + (r.estado === "Despachado" ? "tag-done" : "tag-rest")}>{r.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--green)" }}></span>Despacho OK</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><span className="dot" style={{ background: "var(--orange)" }}></span>Diferencia kg / revisar</span>
      </div>
      <div className="mini-sub" style={{ marginTop: 8 }}>
        Formato semana (fecha de carga efectiva){tieneRevisar && " · 2026-4778: diferencia de 4.725 kg pendiente de regularizar"}
      </div>
    </div>
  );
}

function NovedadesFooter() {
  return (
    <div className="mini-sub" style={{ textAlign: "center", marginTop: 8, marginBottom: 30 }}>
      Vista · Novedades Comerciales · Valbifrut · datos planilla portal Comex al 29-jul-2026
    </div>
  );
}

Object.assign(window, {
  NovedadesFilters, ContratosCard, KilosTemporadaCard, VentaCard, EmbarquesResumenCard,
  TopMercadosBar, TopMercados, UltimosDespachados, NovedadesFooter,
});
