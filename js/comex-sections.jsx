/* ============ COMEX SECTIONS ============ */
const { useState: useStateComex, useRef: useRefComex, useEffect: useEffectComex } = React;

/* ---- generic segmented toggle (reuses .unit-toggle styling) ---- */
function SegToggle({ value, onChange, options }) {
  return (
    <div className="unit-toggle">
      {options.map(([k, lbl]) => (
        <button key={k} className={value === k ? "active" : ""} onClick={() => onChange(k)}>{lbl}</button>
      ))}
    </div>
  );
}

/* ---- section eyebrow with green marker (matches other Comex vistas) ---- */
function SectionEyebrow({ children }) {
  return (
    <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 8, height: 8, background: "var(--green)", borderRadius: 2, display: "inline-block" }}></span>
      {children}
    </div>
  );
}

/* ---- shared card shell: title + context chip + optional sub ---- */
function InfoCard({ title, tag, sub, children }) {
  return (
    <div className="card card-pad">
      <div className="mini-head" style={{ marginBottom: sub ? 6 : 14 }}>
        <h3 className="mini-title">{title}</h3>
        {tag && <span className="chip">{tag}</span>}
      </div>
      {sub && <div className="mini-sub" style={{ marginBottom: 14 }}>{sub}</div>}
      {children}
    </div>
  );
}

/* ---- multi-select dropdown filter ---- */
function MultiSel({ label, options, selected, onChange }) {
  const [open, setOpen] = useStateComex(false);
  const ref = useRefComex(null);
  useEffectComex(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, []);
  const toggle = opt => onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  const summary = selected.length === 0 ? "Todos" : selected.length === 1 ? selected[0] : selected.length + " seleccionados";
  return (
    <div className="filter" ref={ref}>
      <label>{label}</label>
      <div className="select msel">
        <button type="button" className="msel-btn" onClick={() => setOpen(o => !o)}>{summary}</button>
        {open && (
          <div className="msel-panel">
            {options.map(opt => (
              <label key={opt} className="msel-opt">
                <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- top filter bar (6 filtros) ---- */
function ComexFilters({ temporada, setTemporada, mesOperativo, setMesOperativo, semanaRango, setSemanaRango,
  clientes, setClientes, prodvar, setProdvar, estado, setEstado }) {
  return (
    <div className="card filters-comex">
      <div className="filter">
        <label>Temporada</label>
        <div className="select"><select value={temporada} onChange={e => setTemporada(e.target.value)}>
          {TEMPORADAS_COMEX.map(t => <option key={t} value={t}>{t}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Mes operativo</label>
        <div className="select"><select value={mesOperativo} onChange={e => setMesOperativo(e.target.value)}>
          {MESES_OPERATIVOS_COMEX.map(m => <option key={m} value={m}>{m}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Semana</label>
        <div className="select"><select value={semanaRango} onChange={e => setSemanaRango(e.target.value)}>
          {SEMANA_RANGOS_COMEX.map(s => <option key={s} value={s}>{s}</option>)}
        </select></div>
      </div>
      <MultiSel label="Cliente" options={CLIENTES_COMEX} selected={clientes} onChange={setClientes} />
      <MultiSel label="Producto / Variedad" options={PRODVAR_OPCIONES_COMEX} selected={prodvar} onChange={setProdvar} />
      <div className="filter">
        <label>Estado</label>
        <div className="select"><select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          {ESTADOS_COMEX.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
        </select></div>
      </div>
    </div>
  );
}

/* ---- 1. Embarques comprometidos ---- */
function EmbarquesCard({ data }) {
  const { total, despachados, porDespachar, transito } = data;
  return (
    <InfoCard title="Embarques comprometidos" tag="temporada">
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)" }}>{total.toLocaleString("en-US")}</div>
      <table className="t" style={{ marginTop: 10 }}>
        <tbody>
          <tr><td>Despachados</td><td className="num"><span className="cellnum" style={{ color: "var(--green-text)" }}>{despachados}</span></td></tr>
          <tr><td>Por despachar</td><td className="num"><span className="cellnum" style={{ color: "var(--orange)" }}>{porDespachar}</span></td></tr>
          <tr><td>En tránsito <span style={{ color: "var(--muted-2)" }}>(ETA vigente)</span></td><td className="num"><span className="cellnum" style={{ color: "#2e5db3" }}>{transito}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 2. Capacidad planta / stock ---- */
function CapacidadCard({ data }) {
  const { sub, pctOcupacion, stockDisponible, capacidadUtilizada, capacidadDisponible } = data;
  return (
    <InfoCard title="Capacidad planta / stock" tag="semana actual" sub={sub}>
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)" }}>{pctOcupacion}%</div>
      <div className="flujo-bar" style={{ marginTop: 12 }}><span style={{ width: pctOcupacion + "%" }}></span></div>
      <table className="t" style={{ marginTop: 12 }}>
        <tbody>
          <tr><td>Stock disponible</td><td className="num"><span className="cellnum">{fmtKg(stockDisponible)}</span></td></tr>
          <tr><td>Capacidad utilizada</td><td className="num"><span className="cellnum">{fmtKg(capacidadUtilizada)}</span></td></tr>
          <tr><td>Capacidad disponible</td><td className="num"><span className="cellnum">{fmtKg(capacidadDisponible)}</span></td></tr>
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 3. Documentos de embarque ---- */
function DocumentosCard({ data }) {
  const { sub, disponibles, enviados, sinRegistro, aprobados, nota } = data;
  const Stat = ({ label, value }) => (
    <div className="kpi-stat">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ fontSize: 20 }}>{value == null ? "—" : value}</div>
    </div>
  );
  return (
    <InfoCard title="Documentos de embarque" tag="desp. / tránsito" sub={sub}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Stat label="Disponibles" value={disponibles} />
        <Stat label="Enviados" value={enviados} />
        <Stat label="Sin registro" value={sinRegistro} />
        <Stat label="Aprobados" value={aprobados} />
      </div>
      <div className="hint" style={{ marginTop: 12, background: "#faf7ec", border: "1px solid #ecdfb8", borderRadius: 8, padding: "8px 10px" }}>{nota}</div>
    </InfoCard>
  );
}

/* ---- 4. Próximas naves / zarpes ---- */
function NavesCard({ data }) {
  return (
    <InfoCard title="Próximas naves / zarpes" tag="sujeto a validación" sub={data.sub}>
      <table className="t">
        <thead><tr><th style={{ paddingRight: 10, whiteSpace: "nowrap" }}>Fecha</th><th style={{ paddingRight: 10 }}>Nave</th><th>Puerto</th><th className="num">Emb.</th></tr></thead>
        <tbody>
          {data.rows.map(r => (
            <tr key={r.nave}>
              <td className="var" style={{ whiteSpace: "nowrap", paddingRight: 10 }}>{r.fecha}</td>
              <td style={{ paddingRight: 10 }}>{r.nave}</td>
              <td>{r.puerto}</td>
              <td className="num"><span className="cellnum">{r.emb}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfoCard>
  );
}

/* ---- 5. Despachos por período (bar chart) ---- */
function WeekBars({ data, metric }) {
  const W = 640, H = 220, padB = 30, padT = 14;
  const vals = data.map(d => metric === "kg" ? d.kg : d.cantidad);
  const max = Math.max(...vals, 1) * 1.15;
  const n = data.length;
  const slot = W / n;
  const bw = Math.min(34, slot * 0.55);
  const showEvery = Math.ceil(n / 14);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const v = metric === "kg" ? d.kg : d.cantidad;
        const h = (v / max) * (H - padB - padT);
        const x = i * slot + (slot - bw) / 2;
        const y = H - padB - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={Math.max(h, 1)} rx="5"
              fill={d.actual ? "var(--green-light)" : "var(--green)"} />
            {i % showEvery === 0 && (
              <text x={x + bw / 2} y={H - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--muted)">{d.label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function agruparPorMes(data) {
  const byMonth = {};
  data.forEach(d => {
    const f = weekStartComex(d.semana);
    const key = f.getFullYear() + "-" + f.getMonth();
    if (!byMonth[key]) byMonth[key] = { label: MESES_COMEX[f.getMonth()].toUpperCase(), cantidad: 0, kg: 0, actual: false };
    byMonth[key].cantidad += d.cantidad;
    byMonth[key].kg += d.kg;
    if (d.actual) byMonth[key].actual = true;
  });
  return Object.keys(byMonth).sort().map(k => byMonth[k]);
}

function DespachosChart({ data }) {
  const [rango, setRango] = useStateComex("8");
  const [metric, setMetric] = useStateComex("cantidad");
  const sliced = rango === "anual" ? agruparPorMes(data) : data.slice(-parseInt(rango, 10));
  const totalCant = sliced.reduce((s, d) => s + d.cantidad, 0);
  const totalKg = sliced.reduce((s, d) => s + d.kg, 0);
  const actualEnRango = rango === "anual" || sliced.some(d => d.actual);

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Despachos por período</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SegToggle value={rango} onChange={setRango} options={[["4", "4 sem."], ["8", "8 sem."], ["12", "12 sem."], ["anual", "Anual"]]} />
          <SegToggle value={metric} onChange={setMetric} options={[["cantidad", "Cantidad"], ["kg", "Kg"]]} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <WeekBars data={sliced} metric={metric} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 132 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>{totalCant}</div>
            <div className="mini-sub">Despachos en el período</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>{fmtKg(totalKg)}</div>
            <div className="mini-sub">Kg despachados en el período</div>
          </div>
        </div>
      </div>
      <div className="mini-sub" style={{ marginTop: 6 }}>
        * Semana en curso (al {fmtDiaCorto(HOY_COMEX)}), aún sin cierre. En vista Anual el eje agrupa por mes.
      </div>
    </div>
  );
}

/* ---- 6. Stacking por destino ---- */
function StackingTable({ rows }) {
  return (
    <InfoCard title="Stacking por destino" tag="próximos zarpes">
      <table className="t">
        <thead><tr><th>Destino</th><th>Ventana stacking</th><th className="num">Emb.</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.destino}>
              <td className="var">{r.destino}</td>
              <td>{r.ventana}</td>
              <td className="num"><span className="cellnum">{r.emb}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mini-sub" style={{ marginTop: 10 }}>Emb. = embarques por despachar con nave asignada dentro de la ventana.</div>
    </InfoCard>
  );
}

/* ---- 7. Grilla de planificación ---- */
function EstadoBadge({ estado }) {
  const info = estadoInfo(estado);
  return info ? <span className={"tag " + info.cls}>{info.label}</span> : <span style={{ color: "var(--muted-2)" }}>—</span>;
}

function exportCsvComex(rows) {
  const headers = ["Embarque", "Cliente", "Producto", "Variedad", "Kg solic.", "Kg desp.", "Dif.", "% Producción", "Stacking", "Zarpe", "F. carga", "Hora", "Estado"];
  const lines = rows.map(r => [
    r.embarque, r.cliente, r.producto, r.variedad, r.kgSol, r.kgDesp ?? "—", r.diferencia ?? "—",
    r.pct + "%", r.stacking, r.zarpe || "sin nave", fmtFCarga(r), r.hora, estadoInfo(r.estado)?.label || "—",
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "planificacion_comex.csv"; a.click();
  URL.revokeObjectURL(url);
}

function PlanificacionGrid({ rows }) {
  const [vista, setVista] = useStateComex("planMes");
  const filtradas = rows.filter(r => r.vista === vista);
  const PAGE = 8;
  const pageRows = filtradas.slice(0, PAGE);

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Grilla de planificación</h3>
        <button className="btn btn-ghost" onClick={() => exportCsvComex(filtradas)}>{Icon.save}Exportar</button>
      </div>
      <div className="viewtabs" style={{ justifyContent: "flex-start", marginBottom: 14 }}>
        <div className="seg">
          {VISTAS_GRILLA_COMEX.map(v => (
            <button key={v.key} className={vista === v.key ? "active" : ""} onClick={() => setVista(v.key)}>{v.label}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="big">
          <thead>
            <tr>
              <th>Embarque</th><th>Cliente</th><th>Producto</th><th>Variedad</th>
              <th className="num">Kg solic.</th><th className="num" style={{ paddingRight: 14 }}>Kg desp.</th><th className="num" style={{ paddingRight: 16 }}>Dif.</th>
              <th style={{ paddingLeft: 16, whiteSpace: "nowrap" }}>% Producción</th><th>Stacking</th><th>Zarpe</th><th>F. carga</th><th>Hora</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r => (
              <tr key={r.id}>
                <td className="strong">{r.embarque}</td>
                <td>{r.cliente}</td>
                <td>{r.producto}</td>
                <td>{r.variedad}</td>
                <td className="num">{r.kgSol.toLocaleString("en-US")}</td>
                <td className="num">{r.kgDesp == null ? "—" : r.kgDesp.toLocaleString("en-US")}</td>
                <td className="num" style={{ color: r.diferencia < 0 ? "var(--orange)" : "var(--muted)", paddingRight: 16 }}>
                  {r.diferencia == null ? "—" : r.diferencia.toLocaleString("en-US")}
                </td>
                <td style={{ paddingLeft: 16, whiteSpace: "nowrap" }}><span className="cell-bar"><span style={{ width: r.pct + "%" }}></span></span>{r.pct}%</td>
                <td>{r.stacking}</td>
                <td>{r.zarpe || <span className="chip">sin nave</span>}</td>
                <td>{fmtFCarga(r)}</td>
                <td>{r.hora}</td>
                <td><EstadoBadge estado={r.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mini-sub" style={{ marginTop: 12 }}>
        Mostrando {pageRows.length} de {filtradas.length} embarques por despachar · F. carga en formato semana (fecha)
      </div>
    </div>
  );
}

/* ---- 8. Calendario de planificación ---- */
function CalEvent({ row }) {
  const info = estadoInfo(row.estado);
  const dotColor = row.estado === "ok" ? "var(--green)" : row.estado === "porConfirmar" ? "var(--orange)" :
    row.estado === "produccion" ? "#2e5db3" : row.estado === "despachado" ? "var(--green-deep)" : "var(--muted-2)";
  return (
    <div className="cal-event">
      <div className="ev-top"><span className="dot" style={{ background: dotColor }}></span>{row.hora} · {row.embarque}</div>
      <div className="ev-sub">{row.cliente}</div>
      <div className="ev-prod">{row.producto} · {row.variedad}</div>
    </div>
  );
}

function PlanificacionCalendar({ rows }) {
  const [rangoVista, setRangoVista] = useStateComex("2semanas");
  const nWeeks = rangoVista === "semana" ? 1 : rangoVista === "2semanas" ? 2 : 4;
  const hoyIso = isoComex(HOY_COMEX);
  const semanaHoy = SEMANA_ACTUAL_COMEX;
  const inicioVista = weekStartComex(semanaHoy);

  const porFecha = {};
  rows.forEach(r => {
    const f = fechaFila(r);
    if (!f) return;
    const key = isoComex(f);
    (porFecha[key] = porFecha[key] || []).push(r);
  });

  const weeks = Array.from({ length: nWeeks }, (_, w) => {
    const start = addDaysComex(inicioVista, w * 7);
    return Array.from({ length: 7 }, (_, d) => addDaysComex(start, d));
  });

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Calendario de planificación</h3>
        <SegToggle value={rangoVista} onChange={setRangoVista}
          options={[["semana", "Semanal"], ["2semanas", "2 semanas"], ["mes", "Mes"]]} />
      </div>
      {weeks.map((week, wi) => (
        <div className="cal-week" key={wi}>
          {week.map((d, di) => {
            const iso = isoComex(d);
            const events = porFecha[iso] || [];
            const isToday = iso === hoyIso;
            return (
              <div className={"cal-day" + (isToday ? " today" : "")} key={di}>
                <div className="cal-daylabel">
                  <span>{DIAS_SEMANA_COMEX[di]} {d.getDate()}</span>
                  {isToday && <span className="hoy">Hoy</span>}
                </div>
                {events.length === 0
                  ? <div className="cal-empty">Sin carga planificada</div>
                  : events.map(r => <CalEvent row={r} key={r.id} />)}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="dot" style={{ background: "var(--green)" }}></span>Reserva / programación OK</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="dot" style={{ background: "var(--orange)" }}></span>Por confirmar</span>
        <span className="li" style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="dot" style={{ background: "#2e5db3" }}></span>En producción</span>
      </div>
      <div className="mini-sub" style={{ marginTop: 10 }}>Posición diaria referencial: la planilla registra semana compromiso y hora, no fecha exacta de carga.</div>
    </div>
  );
}

function ComexFooter() {
  const fecha = String(HOY_COMEX.getDate()).padStart(2, "0") + "-" + MESES_COMEX[HOY_COMEX.getMonth()] + "-" + HOY_COMEX.getFullYear();
  return (
    <div className="mini-sub" style={{ textAlign: "center", marginTop: 8, marginBottom: 30 }}>
      Vista · Planificación y Comex · Valbifrut · datos planilla portal Comex al {fecha}
    </div>
  );
}

Object.assign(window, {
  SegToggle, SectionEyebrow, InfoCard, MultiSel, ComexFilters,
  EmbarquesCard, CapacidadCard, DocumentosCard, NavesCard,
  WeekBars, agruparPorMes, DespachosChart, StackingTable, EstadoBadge, exportCsvComex,
  PlanificacionGrid, CalEvent, PlanificacionCalendar, ComexFooter,
});
