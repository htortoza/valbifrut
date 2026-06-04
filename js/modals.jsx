/* ============ MODALS ============ */
const DEST_BUDGET = ["Alemania", "Brasil", "Corea", "Italia"];

function ModalShell({ title, sub, onClose, children, foot }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 className="section-title" style={{ fontSize: 17 }}>{title}</h3>
            {sub && <div className="mini-sub" style={{ marginTop: 4 }}>{sub}</div>}
          </div>
          <button className="xclose" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </div>
  );
}

/* ---- Budget editor: variety × destination matrix ---- */
function BudgetModal({ matrix, lastSaved, onSave, onClose }) {
  const [m, setM] = useState(() => JSON.parse(JSON.stringify(matrix)));
  const set = (vk, d, val) => {
    const num = val === "" ? 0 : Math.max(0, parseInt(val.replace(/[^\d]/g, ""), 10) || 0);
    setM(p => ({ ...p, [vk]: { ...p[vk], [d]: num } }));
  };
  const rowTotal = vk => DEST_BUDGET.reduce((s, d) => s + (m[vk][d] || 0), 0);
  const colTotal = d => VARIEDADES.reduce((s, v) => s + (m[v.key][d] || 0), 0);
  const grand = VARIEDADES.reduce((s, v) => s + rowTotal(v.key), 0);

  return (
    <ModalShell
      title="Editar Presupuesto de Recepción"
      sub="Desglose manual por variedad y destino (KG)"
      onClose={onClose}
      foot={
        <React.Fragment>
          <span className="hint">
            {lastSaved ? <span className="save-note">✓ Último guardado: {lastSaved}</span> : "Aún sin registro guardado"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-green" onClick={() => onSave(m)}>{Icon.save}Guardar presupuesto</button>
          </div>
        </React.Fragment>
      }>
      <table className="edit">
        <thead>
          <tr>
            <th>Variedad</th>
            {DEST_BUDGET.map(d => <th key={d} className="num">{d}</th>)}
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {VARIEDADES.map(v => (
            <tr key={v.key}>
              <td className="var">{v.name}</td>
              {DEST_BUDGET.map(d => (
                <td key={d} className="num">
                  <input inputMode="numeric" value={(m[v.key][d] || 0).toLocaleString("en-US")}
                    onChange={e => set(v.key, d, e.target.value)} />
                </td>
              ))}
              <td className="num"><span className="cellnum">{rowTotal(v.key).toLocaleString("en-US")}</span></td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700 }}>
            <td className="var">Total</td>
            {DEST_BUDGET.map(d => <td key={d} className="num"><span className="cellnum">{colTotal(d).toLocaleString("en-US")}</span></td>)}
            <td className="num"><span className="cellnum" style={{ color: "var(--green-text)" }}>{grand.toLocaleString("en-US")}</span></td>
          </tr>
        </tbody>
      </table>
    </ModalShell>
  );
}

/* ---- Quality parameters: manual or from DB ---- */
function CalidadModal({ params, lastSaved, onSave, onClose }) {
  const [src, setSrc] = useState("manual");
  const [rows, setRows] = useState(() => JSON.parse(JSON.stringify(params)));
  const [pulled, setPulled] = useState(false);
  const fromDB = src === "db";

  const pull = () => {
    // simulate fetching authoritative values from the database
    setRows(CALIDAD_PARAMS_DEFAULT.map(r => ({ ...r,
      min: r.min, max: r.max, obj: r.obj })));
    setPulled(true);
  };
  const set = (i, field, val) => {
    setRows(p => p.map((r, idx) => idx === i ? { ...r, [field]: val === "" ? "" : parseFloat(val) } : r));
  };

  return (
    <ModalShell
      title="Parámetros de Calidad"
      sub="Define los rangos de control por análisis de lote"
      onClose={onClose}
      foot={
        <React.Fragment>
          <span className="hint">{lastSaved ? <span className="save-note">✓ Guardado: {lastSaved}</span> : "Sin registro guardado"}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-green" onClick={() => onSave(rows)}>{Icon.save}Guardar parámetros</button>
          </div>
        </React.Fragment>
      }>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div className="src-toggle">
          <button className={src === "manual" ? "active" : ""} onClick={() => setSrc("manual")}>Ingreso manual</button>
          <button className={src === "db" ? "active" : ""} onClick={() => setSrc("db")}>Base de datos</button>
        </div>
        {fromDB && <button className="btn btn-dark" onClick={pull}>{Icon.db}Traer de base de datos</button>}
      </div>
      {fromDB && (
        <div className="hint" style={{ marginBottom: 14 }}>
          {pulled ? "✓ Valores sincronizados desde el laboratorio. Puedes ajustarlos antes de guardar." : "Pulsa “Traer de base de datos” para cargar los últimos análisis registrados."}
        </div>
      )}
      <table className="edit">
        <thead>
          <tr>
            <th>Parámetro</th>
            <th className="num">Mín.</th>
            <th className="num">Máx.</th>
            <th className="num">Objetivo</th>
            <th className="num">Unidad</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key}>
              <td className="var">{r.label}</td>
              {["min","max","obj"].map(f => (
                <td key={f} className="num">
                  <input inputMode="decimal" disabled={fromDB && !pulled} value={r[f]}
                    onChange={e => set(i, f, e.target.value)} />
                </td>
              ))}
              <td className="num" style={{ color: "var(--muted)" }}>{r.unidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalShell>
  );
}

/* ---- Mechanical cracking cuts: manual or from DB ---- */
function CortesModal({ cortes, baseKg, lastSaved, onSave, onClose }) {
  const [src, setSrc] = useState("manual");
  const [rows, setRows] = useState(() => JSON.parse(JSON.stringify(cortes)));
  const [pulled, setPulled] = useState(false);
  const fromDB = src === "db";
  const totalPct = rows.reduce((s, r) => s + (parseFloat(r.pct) || 0), 0);

  const pull = () => { setRows(CORTES_DEFAULT.map(r => ({ ...r }))); setPulled(true); };
  const set = (i, val) => {
    setRows(p => p.map((r, idx) => idx === i ? { ...r, pct: val === "" ? "" : parseFloat(val) } : r));
  };

  return (
    <ModalShell
      title="Cortes del Partido Mecánico"
      sub="Distribución del rendimiento de quebrado por formato"
      onClose={onClose}
      foot={
        <React.Fragment>
          <span className="hint">
            Total:&nbsp;<b style={{ color: Math.round(totalPct) === 100 ? "var(--green-text)" : "var(--orange)" }}>{totalPct.toFixed(0)}%</b>
            {Math.round(totalPct) !== 100 && <span className="neg"> · debe sumar 100%</span>}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-green" onClick={() => onSave(rows)}>{Icon.save}Guardar cortes</button>
          </div>
        </React.Fragment>
      }>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div className="src-toggle">
          <button className={src === "manual" ? "active" : ""} onClick={() => setSrc("manual")}>Ingreso manual</button>
          <button className={src === "db" ? "active" : ""} onClick={() => setSrc("db")}>Base de datos</button>
        </div>
        {fromDB && <button className="btn btn-dark" onClick={pull}>{Icon.db}Traer de base de datos</button>}
      </div>
      {fromDB && (
        <div className="hint" style={{ marginBottom: 14 }}>
          {pulled ? "✓ Cortes sincronizados desde la línea de partido. Ajusta si es necesario." : "Pulsa “Traer de base de datos” para cargar el último parte de producción."}
        </div>
      )}
      <table className="edit">
        <thead>
          <tr>
            <th>Formato de corte</th>
            <th className="num">% Rendimiento</th>
            <th className="num">KG estimados</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key}>
              <td className="var">{r.label}</td>
              <td className="num">
                <input inputMode="decimal" disabled={fromDB && !pulled} value={r.pct}
                  onChange={e => set(i, e.target.value)} />
              </td>
              <td className="num"><span className="cellnum" style={{ color: "var(--muted)" }}>
                {Math.round(baseKg * (parseFloat(r.pct) || 0) / 100).toLocaleString("en-US")}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalShell>
  );
}

Object.assign(window, { DEST_BUDGET, ModalShell, BudgetModal, CalidadModal, CortesModal });
