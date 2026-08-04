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

/* ---- top filter bar ---- */
function ComexFilters({ temporada, setTemporada, semana, setSemana, clientes, setClientes, prodvar, setProdvar }) {
  return (
    <div className="card filters-comex">
      <div className="filter">
        <label>Período</label>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="select" style={{ flex: 1 }}>
            <select value={temporada} onChange={e => setTemporada(e.target.value)}>
              {TEMPORADAS_COMEX.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="select" style={{ flex: 1.4 }}>
            <select value={semana} onChange={e => setSemana(parseInt(e.target.value, 10))}>
              {SEMANAS_COMEX.map(s => <option key={s.n} value={s.n}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>
      <MultiSel label="Cliente" options={CLIENTES_COMEX} selected={clientes} onChange={setClientes} />
      <MultiSel label="Producto / Variedad" options={PRODVAR_OPCIONES_COMEX} selected={prodvar} onChange={setProdvar} />
    </div>
  );
}

/* ---- 1. Embarques comprometidos ---- */
function EmbarquesCard({ data }) {
  const { total, despachados, porDespachar, transito } = data;
  const pct = v => total ? (v / total) * 100 : 0;
  return (
    <div className="card card-pad">
      <div className="eyebrow">Embarques comprometidos</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", marginTop: 6 }}>{total}</div>
      <div className="mini-sub">Embarques totales · temporada en curso</div>
      <div className="seg-bar" style={{ marginTop: 16 }}>
        <span style={{ width: pct(despachados) + "%", background: "var(--green)" }}></span>
        <span style={{ width: pct(porDespachar) + "%", background: "var(--orange)" }}></span>
        <span style={{ width: pct(transito) + "%", background: "#2e5db3" }}></span>
      </div>
      <div className="kpi-row" style={{ marginTop: 14 }}>
        <div className="kpi-stat">
          <div className="kpi-label" style={{ color: "var(--green-text)" }}>Despachados</div>
          <div className="kpi-value">{despachados}</div>
        </div>
        <div className="kpi-stat">
          <div className="kpi-label" style={{ color: "var(--orange)" }}>Por despachar</div>
          <div className="kpi-value">{porDespachar}</div>
        </div>
        <div className="kpi-stat">
          <div className="kpi-label" style={{ color: "#2e5db3" }}>En tránsito</div>
          <div className="kpi-value">{transito}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- 2. Capacidad planta / stock ---- */
function CapacidadCard({ data, semanaLabel }) {
  const { pctOcupacion, stockDisponible, capacidadUtilizada, capacidadDisponible } = data;
  return (
    <div className="card card-pad">
      <div className="eyebrow">Capacidad planta / stock</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", marginTop: 6 }}>{pctOcupacion}%</div>
      <div className="mini-sub">Ocupación planta · {semanaLabel}</div>
      <div className="flujo-bar" style={{ marginTop: 16 }}><span style={{ width: pctOcupacion + "%" }}></span></div>
      <div className="kpi-row" style={{ marginTop: 14 }}>
        <div className="kpi-stat">
          <div className="kpi-label">Stock disponible</div>
          <div className="kpi-value" style={{ fontSize: 16 }}>{fmtKg(stockDisponible)}</div>
        </div>
        <div className="kpi-stat">
          <div className="kpi-label">Capacidad utilizada</div>
          <div className="kpi-value" style={{ fontSize: 16 }}>{fmtKg(capacidadUtilizada)}</div>
        </div>
        <div className="kpi-stat">
          <div className="kpi-label">Capacidad disponible</div>
          <div className="kpi-value" style={{ fontSize: 16 }}>{fmtKg(capacidadDisponible)}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- 3. Despachos por período (bar chart) ---- */
function WeekBars({ data, metric }) {
  const W = 640, H = 240, padB = 30, padT = 14;
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
          <g key={d.semana}>
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

function DespachosChart({ data }) {
  const [rango, setRango] = useStateComex("8");
  const [metric, setMetric] = useStateComex("cantidad");
  const sliced = rango === "anual" ? data : data.slice(-parseInt(rango, 10));
  const totalCant = sliced.reduce((s, d) => s + d.cantidad, 0);
  const totalKg = sliced.reduce((s, d) => s + d.kg, 0);
  const actualEnRango = sliced.some(d => d.actual);

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 className="section-title" style={{ fontSize: 15 }}>Despachos por período</h3>
          <div className="chart-legend" style={{ marginTop: 10 }}>
            <span className="li"><span className="dot" style={{ background: "var(--green)" }}></span>Semana cerrada</span>
            <span className="li"><span className="dot" style={{ background: "var(--green-light)" }}></span>Semana en curso</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SegToggle value={rango} onChange={setRango} options={[["4", "4 sem."], ["8", "8 sem."], ["12", "12 sem."], ["anual", "Anual"]]} />
          <SegToggle value={metric} onChange={setMetric} options={[["cantidad", "Cantidad"], ["kg", "Kg"]]} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <WeekBars data={sliced} metric={metric} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <div className="mini-sub">Total del período: <b style={{ color: "var(--ink)" }}>{totalCant} despachos</b> · {fmtKg(totalKg)}</div>
        {actualEnRango && <span className="eyebrow" style={{ color: "var(--green-text)" }}>Semana actual aún sin cerrar</span>}
      </div>
    </div>
  );
}

/* ---- 4. Stacking por destino ---- */
function StackingTable({ rows }) {
  const [soloProximos, setSoloProximos] = useStateComex(true);
  const shown = soloProximos ? rows.slice(0, 4) : rows;
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Stacking por destino</h3>
        <SegToggle value={soloProximos ? "prox" : "todos"} onChange={v => setSoloProximos(v === "prox")}
          options={[["prox", "Próximos zarpes"], ["todos", "Todos"]]} />
      </div>
      <table className="t">
        <thead>
          <tr><th>Destino</th><th>Ventana</th><th className="num">Embarques</th></tr>
        </thead>
        <tbody>
          {shown.map(r => {
            const start = weekStartComex(r.semana); start.setDate(start.getDate() + r.dow);
            const end = addDaysComex(start, r.dias);
            return (
              <tr key={r.destino}>
                <td className="var">{r.destino}</td>
                <td>{fmtDiaCorto(start)} – {fmtDiaCorto(end)}</td>
                <td className="num"><span className="cellnum">{r.embarques}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---- 5. Grilla de planificación ---- */
function EstadoBadge({ estado }) {
  const info = estadoInfo(estado);
  return <span className={"tag " + info.cls}>{info.label}</span>;
}

function exportCsvComex(rows) {
  const headers = ["Embarque", "Cliente", "Producto", "Variedad", "Kg solicitados", "Kg despachados", "Diferencia", "% Producción", "Stacking", "Zarpe", "Fecha de carga", "Hora", "Estado"];
  const lines = rows.map(r => {
    const f = fechaFila(r);
    return [r.embarque, r.cliente, r.producto, r.variedad, r.kgSol, r.kgDesp, r.diferencia, r.pct + "%", r.stacking, r.zarpe || "—", f ? fmtDiaCorto(f) : "—", r.hora, estadoInfo(r.estado).label]
      .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "planificacion_comex.csv"; a.click();
  URL.revokeObjectURL(url);
}

function PlanificacionGrid({ rows }) {
  const [vista, setVista] = useStateComex("planMes");
  const [estadoF, setEstadoF] = useStateComex("Todos");

  const porVista = rows.filter(r => r.vista === vista);
  const filtradas = estadoF === "Todos" ? porVista : porVista.filter(r => r.estado === estadoF);
  const PAGE = 8;
  const pageRows = filtradas.slice(0, PAGE);

  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Grilla de planificación</h3>
        <button className="btn btn-ghost" onClick={() => exportCsvComex(filtradas)}>{Icon.save}Exportar</button>
      </div>
      <div className="viewtabs" style={{ justifyContent: "flex-start", marginBottom: 12 }}>
        <div className="seg">
          {VISTAS_GRILLA_COMEX.map(v => (
            <button key={v.key} className={vista === v.key ? "active" : ""} onClick={() => setVista(v.key)}>{v.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <div className="select" style={{ minWidth: 160 }}>
          <select value={estadoF} onChange={e => setEstadoF(e.target.value)}>
            <option value="Todos">Estado: Todos</option>
            {ESTADOS_COMEX.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="big">
          <thead>
            <tr>
              <th>Embarque</th><th>Cliente</th><th>Producto</th><th>Variedad</th>
              <th className="num">Kg sol.</th><th className="num">Kg desp.</th><th className="num">Dif.</th>
              <th>% Producción</th><th>Stacking</th><th>Zarpe</th><th>Fecha carga</th><th>Hora</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r => {
              const f = fechaFila(r);
              return (
                <tr key={r.id}>
                  <td className="strong">{r.embarque}</td>
                  <td>{r.cliente}</td>
                  <td>{r.producto}</td>
                  <td>{r.variedad}</td>
                  <td className="num">{r.kgSol.toLocaleString("en-US")}</td>
                  <td className="num">{r.kgDesp.toLocaleString("en-US")}</td>
                  <td className="num" style={{ color: r.diferencia < 0 ? "var(--orange)" : "var(--muted)", paddingRight: 16 }}>{r.diferencia.toLocaleString("en-US")}</td>
                  <td style={{ paddingLeft: 16, whiteSpace: "nowrap" }}><span className="cell-bar"><span style={{ width: r.pct + "%" }}></span></span>{r.pct}%</td>
                  <td>{r.stacking}</td>
                  <td>{r.zarpe || "—"}</td>
                  <td>{f ? fmtDiaCorto(f) : "—"}</td>
                  <td>{r.hora}</td>
                  <td><EstadoBadge estado={r.estado} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mini-sub" style={{ marginTop: 12 }}>Mostrando {pageRows.length} de {filtradas.length} embarques por despachar</div>
    </div>
  );
}

/* ---- 6. Calendario de planificación ---- */
function CalEvent({ row }) {
  const info = estadoInfo(row.estado);
  const dotColor = row.estado === "ok" ? "var(--green)" : row.estado === "porConfirmar" ? "var(--orange)" : row.estado === "produccion" ? "#2e5db3" : "var(--muted-2)";
  return (
    <div className="cal-event">
      <div className="ev-top"><span className="dot" style={{ background: dotColor }}></span>{row.hora} · {row.embarque}</div>
      <div className="ev-sub">{row.cliente}</div>
      <div className="ev-prod">{row.producto} · {row.variedad}</div>
    </div>
  );
}

function PlanificacionCalendar({ rows, semanaActual }) {
  const [rangoVista, setRangoVista] = useStateComex("semana");
  const nWeeks = rangoVista === "semana" ? 1 : rangoVista === "2semanas" ? 2 : 4;
  const hoy = weekStartComex(semanaActual);
  const hoyIso = isoComex(hoy);

  const porFecha = {};
  rows.forEach(r => {
    const f = fechaFila(r);
    if (!f) return;
    const key = isoComex(f);
    (porFecha[key] = porFecha[key] || []).push(r);
  });

  const weeks = Array.from({ length: nWeeks }, (_, w) => {
    const start = addDaysComex(hoy, w * 7);
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
    </div>
  );
}

function ComexFooter() {
  return (
    <div className="mini-sub" style={{ textAlign: "center", marginTop: 8, marginBottom: 30 }}>
      Vista · Planificación y Comex · Valbifrut · datos planilla portal Comex al {new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })}
    </div>
  );
}

Object.assign(window, {
  SegToggle, MultiSel, ComexFilters, EmbarquesCard, CapacidadCard,
  WeekBars, DespachosChart, StackingTable, EstadoBadge, exportCsvComex,
  PlanificacionGrid, CalEvent, PlanificacionCalendar, ComexFooter,
});
