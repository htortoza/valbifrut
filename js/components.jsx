/* ============ CHARTS & SHARED VISUALS ============ */
const { useState, useRef, useEffect } = React;

/* ---- Donut ring ---- */
function Donut({ pct, size = 132, stroke = 16, color = "var(--green)", track = "#eef0f2", center }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center" }}>
        {center}
      </div>
    </div>
  );
}

/* ---- Annual sales bar chart (Proyección vs Histórico) ---- */
function AnnualBars({ data }) {
  const W = 600, H = 270, padB = 34, padT = 14;
  const max = Math.max(...data.map(d => d.val)) * 1.12;
  const n = data.length;
  const slot = W / n;
  const bw = 46;
  // historical reference line approx (prior-year avg trend) per bar
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const h = ((d.val) / max) * (H - padB - padT);
        const x = i * slot + (slot - bw) / 2;
        const y = H - padB - h;
        // prior-year dashed marker
        const prev = i > 0 ? data[i-1].val : d.val;
        const ph = (prev / max) * (H - padB - padT);
        const py = H - padB - ph;
        const isProj = !d.hist;
        return (
          <g key={d.year}>
            {/* dashed historical marker */}
            <line x1={x - 6} x2={x + bw + 6} y1={py} y2={py}
              stroke="#c9ced4" strokeWidth="2" strokeDasharray="5 4" />
            <rect x={x} y={y} width={bw} height={h} rx="6"
              fill={isProj ? "var(--green)" : "var(--green-light)"}
              stroke={isProj ? "none" : "none"} />
            <text x={x + bw/2} y={H - 12} textAnchor="middle"
              fontSize="11" fontWeight="600" fill="var(--muted)"
              style={{ letterSpacing: ".04em" }}>{d.year}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---- Volume by country (multi-line) ---- */
function LineChart({ data }) {
  const W = 660, H = 320, padL = 8, padR = 8, padB = 34, padT = 14;
  const series = [
    { key: "ale", color: "#15a04a", w: 3 },
    { key: "bra", color: "#7fdd9c", w: 3 },
    { key: "kor", color: "#9aa1a8", w: 2.5 },
  ];
  const all = [...data.ale, ...data.bra, ...data.kor];
  const max = Math.max(...all) * 1.1;
  const min = 0;
  const n = data.meses.length;
  const xAt = i => padL + (i / (n - 1)) * (W - padL - padR);
  const yAt = v => padT + (1 - (v - min) / (max - min)) * (H - padB - padT);
  function path(arr) {
    // smooth-ish via simple line
    return arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");
  }
  const labelIdx = [0, 2, 4, 6, 8, 11];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
      {series.map(s => (
        <path key={s.key} d={path(data[s.key])} fill="none" stroke={s.color}
          strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {labelIdx.map(i => (
        <text key={i} x={xAt(i)} y={H - 10} textAnchor="middle"
          fontSize="11" fontWeight="500" fill="var(--muted)">{data.meses[i]}</text>
      ))}
    </svg>
  );
}

/* ---- Select control ---- */
function Sel({ label, value, options, onChange }) {
  return (
    <div className="filter">
      <label>{label}</label>
      <div className="select">
        <select value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ---- Unit toggle KG / USD / % ---- */
function UnitToggle({ value, onChange }) {
  const opts = [["kg","KG"],["usd","USD"],["pct","%"]];
  return (
    <div className="unit-toggle" role="tablist" aria-label="Unidad de visualización">
      {opts.map(([k, lbl]) => (
        <button key={k} className={value === k ? "active" : ""} onClick={() => onChange(k)}>{lbl}</button>
      ))}
    </div>
  );
}

/* ---- tiny inline icons ---- */
const Icon = {
  edit: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  sliders: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  scissors: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  db: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>,
  save: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  chart: <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
};

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

/* ---- section eyebrow with green marker ---- */
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
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
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

Object.assign(window, { Donut, AnnualBars, LineChart, Sel, UnitToggle, Icon, SegToggle, SectionEyebrow, InfoCard, MultiSel });
