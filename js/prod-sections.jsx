/* ============ PRODUCTION SECTIONS ============ */

/* ---- Calibres area/curve chart ---- */
function CalibresCurveChart({ data }) {
  const W = 640, H = 248, padL = 54, padR = 14, padB = 28, padT = 16;
  const cW = W - padL - padR;
  const cH = H - padB - padT;
  const maxY = 38;
  const yTicks = [0, 5, 10, 15, 20, 25, 30, 35];
  const n = data.length;

  const xAt = i => padL + (i / (n - 1)) * cW;
  const yAt = v => padT + (1 - v / maxY) * cH;
  const bottom = H - padB;

  function smoothPath(pts) {
    let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const t = 0.3;
      const cp1x = p1[0] + (p2[0] - p0[0]) * t;
      const cp1y = p1[1] + (p2[1] - p0[1]) * t;
      const cp2x = p2[0] - (p3[0] - p1[0]) * t;
      const cp2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  const pts1 = data.map((d, i) => [xAt(i), yAt(d.pct)]);
  const pts2 = data.map((d, i) => [xAt(i), yAt(d.pct2 !== undefined ? d.pct2 : d.pct)]);
  const line1 = smoothPath(pts1);
  const line2 = smoothPath(pts2);
  const area1 = line1 + ` L ${pts1[n-1][0].toFixed(1)},${bottom} L ${pts1[0][0].toFixed(1)},${bottom} Z`;
  const area2 = line2 + ` L ${pts2[n-1][0].toFixed(1)},${bottom} L ${pts2[0][0].toFixed(1)},${bottom} Z`;

  const GT34_LABELS = ["34-36", "36+"];
  const LT30_LABELS = ["<26", "26-28", "28-30"];
  const pctGt34  = data.filter(d => GT34_LABELS.includes(d.label)).reduce((s, d) => s + d.pct, 0);
  const pctLt30  = data.filter(d => LT30_LABELS.includes(d.label)).reduce((s, d) => s + d.pct, 0);
  const pct2Gt34 = data.filter(d => GT34_LABELS.includes(d.label)).reduce((s, d) => s + (d.pct2 ?? d.pct), 0);
  const pct2Lt30 = data.filter(d => LT30_LABELS.includes(d.label)).reduce((s, d) => s + (d.pct2 ?? d.pct), 0);

  const fmt  = v => v.toFixed(2).replace(".", ",") + "%";
  const fmtD = (a, b) => ((a - b) >= 0 ? "+" : "") + (a - b).toFixed(2).replace(".", ",") + "%";

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 14 }}>Calibres</div>

      {/* SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
        {/* grid horizontales */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="#e8eaed" strokeWidth="1" />
            <text x={padL - 5} y={yAt(v) + 3.5} textAnchor="end" fontSize="9" fill="var(--muted)">{v}.00%</text>
          </g>
        ))}

        {/* área rellena */}
        <path d={area1} fill="rgba(78,122,40,.16)" />

        {/* línea */}
        <path d={line1} fill="none" stroke="#4e7a28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* dots + labels */}
        {data.map((d, i) => {
          const x = xAt(i), y = yAt(d.pct);
          return (
            <g key={"s1" + i}>
              <circle cx={x} cy={y} r="3.5" fill="#4e7a28" />
              <text x={x} y={y - 7} textAnchor="middle" fontSize="9" fontWeight="700" fill="#4e7a28">
                {d.pct.toFixed(2)}%
              </text>
            </g>
          );
        })}

        {/* eje X */}
        {data.map((d, i) => (
          <text key={"xl" + i} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{d.label}</text>
        ))}
      </svg>
    </div>
  );
}

/* ---- Horizontal bar chart (dual-series) ---- */
function HorizBarChart({ data, title, dual, legend }) {
  const maxPct = Math.max(...data.map(d => Math.max(d.pct, d.pct2 || 0)), 1);
  const leg = legend || ["Actual", "Anterior"];
  return (
    <div>
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="eyebrow">{title}</div>
          {dual && (
            <div className="chart-legend" style={{ margin: 0 }}>
              <span className="li"><span className="dot" style={{ background: "var(--green)" }}></span>{leg[0]}</span>
              <span className="li"><span className="dot" style={{ background: "var(--green-mint)" }}></span>{leg[1]}</span>
            </div>
          )}
        </div>
      )}
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{d.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>{d.pct}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ height: 6, background: "#eef0f2", borderRadius: 4, overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: (d.pct / maxPct * 100) + "%", background: "var(--green)", borderRadius: 4, transition: "width .4s ease" }}></span>
            </div>
            {dual && d.pct2 !== undefined && (
              <div style={{ height: 6, background: "#eef0f2", borderRadius: 4, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: (d.pct2 / maxPct * 100) + "%", background: "var(--green-mint)", borderRadius: 4, transition: "width .4s ease" }}></span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- KPI stat chip ---- */
function KpiStat({ label, value, sub, highlight, tone }) {
  const toneColor = tone === "green" ? "var(--green-deep)" : tone === "orange" ? "#c96a00" : tone === "red" ? "#c0392b" : null;
  const valueStyle = toneColor ? { color: toneColor } : highlight ? { color: "var(--green-deep)" } : {};
  return (
    <div className="kpi-stat" style={highlight ? { background: "var(--green-lighter)", borderColor: "var(--green-light)" } : {}}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={valueStyle}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

/* ---- Section header with green left accent ---- */
function SectionHeader({ title, children }) {
  return (
    <div className="prod-section-head">
      <span className="prod-section-label">{title}</span>
      {children}
    </div>
  );
}

/* ---- Dark full-width process divider ---- */
function ProcesoDivider({ label }) {
  return (
    <div className="proceso-divider">{label}</div>
  );
}

/* ---- Grouped vertical bars (partido MT vs AT) ---- */
function PartidoBars({ data }) {
  const W = 520, H = 170, padB = 26, padT = 10;
  const max = Math.max(...data.flatMap(d => [d.mt, d.at])) * 1.18;
  const n = data.length;
  const slot = W / n;
  const bw = 17;
  const gap = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const hMt = (d.mt / max) * (H - padB - padT);
        const hAt = (d.at / max) * (H - padB - padT);
        const cx = i * slot + slot / 2;
        return (
          <g key={d.label}>
            <rect x={cx - bw - gap / 2} y={H - padB - hMt} width={bw} height={hMt} rx="4" fill="var(--green)" />
            <rect x={cx + gap / 2}      y={H - padB - hAt} width={bw} height={hAt} rx="4" fill="var(--green-mint)" />
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ======================================================
   RESUMEN SUPERIOR
====================================================== */
function ResumenSuperior() {
  const d = RESUMEN_DATA;

  function fmtKg(v)  { return (v === null || v === undefined) ? "-" : v.toLocaleString("es-CL") + " kg"; }
  function fmtPct(v) { return (v === null || v === undefined) ? "-" : v + "%"; }
  function fmtKgH(v) { return (v === null || v === undefined) ? "-" : v.toLocaleString("es-CL") + " kg/h"; }

  function SemCard({ titulo, valorStr, metaStr, esNulo, ok }) {
    const valueColor = esNulo ? "var(--muted)" : ok ? "var(--green-deep)" : "#c0392b";
    return (
      <div style={{
        background: "#fafbfc", border: "1px solid var(--line)",
        borderRadius: "var(--radius-sm)", padding: "12px 14px",
        cursor: "default", userSelect: "none",
      }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{titulo}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: valueColor, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>{valorStr}</div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 5 }}>Meta: {metaStr}</div>
      </div>
    );
  }

  function card(titulo, valorStr, metaStr, esNulo, ok) {
    return <SemCard titulo={titulo} valorStr={valorStr} metaStr={metaStr} esNulo={esNulo} ok={ok} />;
  }
  function cardKg(titulo, val, meta) {
    const nulo = val === null || val === undefined;
    return card(titulo, fmtKg(val), fmtKg(meta), nulo, !nulo && val >= meta);
  }

  const { calibradoNCC: ca, seleccionNSC: sn, seleccionNCC: sc, envasadoNSC: en, envasadoNCC: ec, prodHH: hh, eficienciaMaquina: em } = d;

  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {/* Fila 1 */}
        {cardKg("Calibrado NCC · Diario",   ca.diario.producido,    ca.diario.meta)}
        {cardKg("Calibrado NCC · Temp.",     ca.temporada.acumulado, ca.temporada.meta)}
        {cardKg("Selección NSC · Diario",    sn.diario.producido,    sn.diario.meta)}
        {cardKg("Selección NSC · Temp.",     sn.temporada.acumulado, sn.temporada.meta)}
        {/* Fila 2 */}
        {cardKg("Selección NCC · Diario",    sc.diario.producido,    sc.diario.meta)}
        {cardKg("Selección NCC · Temp.",     sc.temporada.acumulado, sc.temporada.meta)}
        {cardKg("Envasado NSC · Diario",     en.diario.producido,    en.diario.meta)}
        {cardKg("Envasado NSC · Temp.",      en.temporada.acumulado, en.temporada.meta)}
        {/* Fila 3 */}
        {cardKg("Envasado NCC · Diario",     ec.diario.producido,    ec.diario.meta)}
        {cardKg("Envasado NCC · Temp.",      ec.temporada.acumulado, ec.temporada.meta)}
        {card("Productividad HH",  fmtKgH(hh.valor), fmtKgH(hh.meta), hh.valor === null, hh.valor !== null && hh.valor >= hh.meta)}
        {card("Eficiencia Máquina", fmtPct(em.valor), fmtPct(em.meta), em.valor === null, em.valor !== null && em.valor >= em.meta)}
      </div>
    </div>
  );
}

/* ======================================================
   SECTION 1 — CALIBRADO
====================================================== */
function CalibradorSection() {
  const d = CALIBRADO_DATA;
  const [maquina, setMaquina] = React.useState("Todas");
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <SectionHeader title="CALIBRADO" />
        <Sel label="Máquina calibrada" value={maquina}
          options={["Todas", "Máquina 1", "Máquina 2", "Máquina 3"]}
          onChange={setMaquina} />
      </div>

      {/* 4 cards en fila */}
      <div className="prod-4cards" style={{ marginBottom: 20 }}>
        <KpiStat label="Volumen Total"  value={d.volumenTotal.toLocaleString("en-US")} sub={d.kgHora.toLocaleString("en-US") + " kg / hora"} highlight />
        <KpiStat label="Descarte"       value={d.descarte.toLocaleString("en-US")}     sub={d.descarteHora + " kg / hora"} />
        <KpiStat label="Prod. Máquina"  value={d.prodMaquina.toLocaleString("en-US")}  sub={d.prodMaquinaSub} />
        <KpiStat label="Prod. Hombre"   value={d.prodHombre.toLocaleString("en-US")}   sub={d.prodHombreSub} />
      </div>

      {/* calibres + tabla productores */}
      <div className="prod-calibrado-grid">
        <div>
          <CalibresCurveChart data={d.calibres} />
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Productores</div>
          <table className="t">
            <thead>
              <tr>
                <th>Fundo / Productor</th>
                <th className="num">Lote</th>
                <th className="num">Cant. KG</th>
              </tr>
            </thead>
            <tbody>
              {d.productores.map((c, i) => (
                <tr key={i}>
                  <td className="var">{c.nombre}</td>
                  <td className="num"><span className="cellnum">{c.lote}</span></td>
                  <td className="num"><span className="cellnum pos">{c.kg}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SECTION 2 — ENSACADO
====================================================== */
function EnsacadoSection() {
  const d = ENSACADO_DATA;
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 18 }}><SectionHeader title="ENSACADO" /></div>
      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KpiStat label="Volumen total ensacado" value={d.volumenTotal.toLocaleString("en-US") + " kg"} sub={d.volumenPct} highlight />
        <KpiStat label="Descarte"               value={d.descarte.toLocaleString("en-US") + " kg"}    sub={d.descartePct} />
        <KpiStat label="Vanas"                  value={d.vanas.toLocaleString("en-US") + " kg"}       sub={d.vanasPct} />
        <KpiStat label="Productividad máquina"  value={d.prodMaquina + "%"} tone="green" />
        <KpiStat label="Productividad hombre"   value={d.prodHombre + "%"}  tone="orange" />
      </div>

      {/* lotes table */}
      <div style={{ marginBottom: 20 }}>
        <table className="t">
          <thead>
            <tr>
              <th>Producto</th>
              <th>#</th>
              <th>Cliente</th>
              <th className="num" style={{ paddingRight: 20 }}>Kilos</th>
              <th style={{ paddingLeft: 8 }}>Envase</th>
              <th>Variedad</th>
              <th>Envasado</th>
              <th>Ensacado</th>
            </tr>
          </thead>
          <tbody>
            {d.lotes.map((l, i) => (
              <tr key={i}>
                <td className="var">{l.producto}</td>
                <td>{l.num}</td>
                <td>{l.cliente}</td>
                <td className="num" style={{ paddingRight: 20 }}><span className="cellnum">{l.kilos}</span></td>
                <td style={{ paddingLeft: 8 }}>{l.envase}</td>
                <td>{l.variedad}</td>
                <td>{l.envasado}</td>
                <td>{l.ensacado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2×2 charts */}
      <div className="prod-charts-grid">
        <div className="prod-chart-card">
          <HorizBarChart data={d.calibres} title="Calibres" dual />
        </div>
        <div className="prod-chart-card">
          <HorizBarChart data={d.defectosExt} title="Defectos externos" dual />
        </div>
        <div className="prod-chart-card">
          <HorizBarChart data={d.defectosInt} title="Defectos internos" dual />
        </div>
        <div className="prod-chart-card">
          <HorizBarChart data={d.colores} title="Colores" dual />
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SECTION 3 — PARTIDO MECÁNICO
====================================================== */
function PartidoSection() {
  const d = PARTIDO_DATA;
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SectionHeader title="PARTIDO MECÁNICO" />
          <span className="tag tag-done">Partido</span>
          <span className="tag tag-plan">AT</span>
        </div>
        <span className="eyebrow">01 Jan 2025 — 19 Jan 2025</span>
      </div>

      {/* KPI row 1 */}
      <div className="kpi-row" style={{ marginBottom: 12 }}>
        <KpiStat label="Rendimiento de pepa" value={d.rendPepa + "%"} highlight />
        <KpiStat label="Motivo"              value={d.motivo + "%"} />
        <KpiStat label="Total partido"       value={d.totalPartido.toLocaleString("en-US") + " kg"} />
        <KpiStat label="MT Stock"            value={d.mtStock.toLocaleString("en-US") + " kg"} />
        <KpiStat label="AT Stock"            value={d.atStock.toLocaleString("en-US") + " kg"} />
      </div>

      {/* KPI row 2 */}
      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KpiStat label="KG / día"  value={d.kgDia.toLocaleString("en-US") + " kg/día"} highlight />
        <KpiStat label="% Merma"   value={d.pctMerma + "%"} />
        <KpiStat label="Rechazo"   value={d.rechazo.toLocaleString("en-US") + " kg"} />
      </div>

      {/* cuadrillas + bars */}
      <div className="grid-mid">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Rendimiento por cuadrilla</div>
          <table className="t">
            <thead>
              <tr>
                <th>Cuadrilla</th>
                <th className="num">L.HP</th>
                <th className="num">Destino</th>
              </tr>
            </thead>
            <tbody>
              {d.cuadrillas.map((c, i) => (
                <tr key={i}>
                  <td className="var">{c.nombre}</td>
                  <td className="num"><span className="cellnum">{c.lhp}</span></td>
                  <td className="num">{c.destino}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prod-chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="eyebrow">Desglose de partido por noche y temporada</div>
            <div className="chart-legend">
              <span className="li"><span className="dot" style={{ background: "var(--green)" }}></span>MT</span>
              <span className="li"><span className="dot" style={{ background: "var(--green-mint)" }}></span>AT</span>
            </div>
          </div>
          <PartidoBars data={d.barras} />
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SECTION 4 — SELECCIÓN Y ENVASADO
====================================================== */
function SeleccionSection() {
  const d = SELECCION_DATA;
  return (
    <div style={{ marginBottom: 16 }}>
      <ProcesoDivider label="SELECCIÓN Y ENVASADO" />
      <div className="card card-pad">
        {/* KPI row */}
        <div className="kpi-row" style={{ marginBottom: 20 }}>
          <KpiStat label="Stock de selección"  value={d.stockSel.toLocaleString("en-US") + " KG"} highlight />
          <KpiStat label="KG Entrada (repr)"   value={d.kgEntrada.toLocaleString("en-US")} />
          <KpiStat label="Eficiencia de línea" value={d.eficiencia + "%"} highlight />
          <KpiStat label="Productividad"       value={d.productividad.toLocaleString("en-US")} />
          <KpiStat label="Unidades"            value={d.unidades.toLocaleString("en-US")} />
        </div>

        {/* sources table */}
        <div style={{ marginBottom: 20 }}>
          <table className="t">
            <thead>
              <tr>
                <th>Fundo</th>
                <th>Embargado</th>
                <th>Productor</th>
                <th>Destino</th>
                <th>Cliente Final</th>
                <th>Producto</th>
                <th>Variedad</th>
              </tr>
            </thead>
            <tbody>
              {d.fuentes.map((f, i) => (
                <tr key={i}>
                  <td className="var">{f.fundo}</td>
                  <td>{f.embargado}</td>
                  <td>{f.productor}</td>
                  <td>{f.destino}</td>
                  <td>{f.clienteFinal}</td>
                  <td>{f.producto}</td>
                  <td>{f.variedad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2×2 charts */}
        <div className="prod-charts-grid">
          <div className="prod-chart-card">
            <HorizBarChart data={d.calibres} title="Calibres" dual />
          </div>
          <div className="prod-chart-card">
            <HorizBarChart data={d.defectosInt} title="Defectos internos" dual />
          </div>
          <div className="prod-chart-card">
            <HorizBarChart data={d.colores} title="Colores" dual />
          </div>
          <div className="prod-chart-card">
            <HorizBarChart data={d.tolerancia} title="Tolerancia" dual />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SECTION 5 — CONSOLIDADO DE PRODUCTO FINAL
====================================================== */
function ConsolidadoSection() {
  const d = CONSOLIDADO_DATA;
  return (
    <div className="prod-consolidado">
      <div className="prod-consolidado-head">
        CONSOLIDADO DE PRODUCTO FINAL
      </div>
      <table className="prod-cons-table">
        <thead>
          <tr>
            <th>Calibrado</th>
            <th className="num">Presentación</th>
            <th className="num">Variedad</th>
            <th className="num">Estado</th>
            <th className="num">Cant./KG</th>
            <th className="num">Monto</th>
          </tr>
        </thead>
        <tbody>
          {d.map((r, i) => (
            <tr key={i}>
              <td className="var">{r.calibrado}</td>
              <td className="num">{r.presentacion}</td>
              <td className="num">
                <span className={"cellnum " + (r.negVar ? "neg" : "pos")}>{r.variedad}</span>
              </td>
              <td className="num">{r.estado}</td>
              <td className="num"><span className="cellnum pos">{r.cantKg}</span></td>
              <td className="num"><span className="cellnum pos">{r.monto}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="prod-cuadratura">
        <span>CUADRATURA DEL LOTE DISTRICT 68 APROX</span>
        <span className="prod-cuadratura-pct">98.61%</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  CalibresCurveChart, HorizBarChart, KpiStat, SectionHeader, ProcesoDivider, PartidoBars,
  ResumenSuperior, CalibradorSection, EnsacadoSection, PartidoSection,
  SeleccionSection, ConsolidadoSection,
});
