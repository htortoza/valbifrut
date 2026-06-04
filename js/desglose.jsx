/* ============ DESGLOSE POR PRODUCTO + CALCULADORA (nueva sección) ============ */
const { useState: useStateDesg } = React;

// ---- Productos por tipo (calibres exactos) ----
const NCC_PROD = [
  { name: "+36mm",    desp: 142000, comp: 38000, xv: 60000,  fob: 3.10 },
  { name: "34-36mm",  desp: 128000, comp: 34000, xv: 52000,  fob: 2.95 },
  { name: "32-34mm",  desp: 96000,  comp: 28000, xv: 44000,  fob: 2.70 },
  { name: "30-32mm",  desp: 74000,  comp: 22000, xv: 36000,  fob: 2.45 },
  { name: "28-30mm",  desp: 52000,  comp: 16000, xv: 24000,  fob: 2.20 },
  { name: "26-28mm",  desp: 34000,  comp: 10000, xv: -5200,  fob: 1.95 },
  { name: "-26mm",    desp: 18000,  comp: 6000,  xv: -8400,  fob: 1.60 },
];

const NSC_PROD = [
  { name: "Mariposas EL/L",            desp: 88000, comp: 24000, xv: 40000,  fob: 8.40 },
  { name: "Cuartos EL/L",              desp: 62000, comp: 18000, xv: 30000,  fob: 7.20 },
  { name: "Cuartillos 6-9 y 9-13mm",   desp: 44000, comp: 12000, xv: 22000,  fob: 6.10 },
  { name: "Cuartillos 3-6 mm",         desp: 28000, comp: 8000,  xv: 14000,  fob: 5.30 },
  { name: "Harinilla",                 desp: 16000, comp: 5000,  xv: -3100,  fob: 3.80 },
  { name: "Otros colores (LA, Am, A)", desp: 22000, comp: 7000,  xv: 12000,  fob: 4.50 },
  { name: "Industrial A y B",          desp: 30000, comp: 9000,  xv: -6800,  fob: 3.20 },
  { name: "Descartes / Desecho",       desp: 9000,  comp: 2000,  xv: 4000,   fob: 0.90 },
  { name: "Basura",                    desp: 3000,  comp: 0,     xv: 0,      fob: 0 },
];
const ALL_PROD = [...NCC_PROD, ...NSC_PROD];

// Calibres de entrada para la calculadora (materia prima en cáscara)
const CALC_INPUTS = [
  { name: "+36mm",   def: 140000 },
  { name: "34-36mm", def: 120000 },
  { name: "32-34mm", def: 90000  },
  { name: "30-32mm", def: 70000  },
  { name: "28-30mm", def: 45000  },
  { name: "26-28mm", def: 25000  },
  { name: "-26mm",   def: 12000  },
];

// Matrices de producto: multiplicadores de grupo sobre el peso base (xv)
const MATRIZ_MULT = {
  "Estándar Exportación": () => 1,
  "Premium Europa": (p, grp) =>
    (grp === "NCC" && ["+36mm","34-36mm","32-34mm"].includes(p.name)) ? 2.2 :
    (grp === "NSC" && ["Mariposas EL/L","Cuartos EL/L"].includes(p.name)) ? 2.0 :
    0.5,
  "Volumen Industrial": (p, grp) =>
    ["Industrial A y B","Harinilla","Cuartillos 3-6 mm","-26mm","26-28mm"].includes(p.name) ? 2.2 : 0.6,
};
const MATRIZ_OPCIONES = Object.keys(MATRIZ_MULT);

function colTotal(arr, k) { return arr.reduce((s, r) => s + r[k], 0); }

function ProductRows({ rows, grp, unit, totals }) {
  return (
    <React.Fragment>
      <tr className="grp">
        <td colSpan={4}>{grp === "NCC" ? "NCC · Nuez con Cáscara" : "NSC · Nuez sin Cáscara"}</td>
      </tr>
      {rows.map(r => (
        <tr key={r.name}>
          <td className="var">{r.name}</td>
          <td className="num"><span className="cellnum" style={{ fontWeight: 500 }}>{fmtUnit(r.desp, r.fob, unit, totals.desp)}</span></td>
          <td className="num"><span className="cellnum" style={{ fontWeight: 500 }}>{fmtUnit(r.comp, r.fob, unit, totals.comp)}</span></td>
          <td className="num"><span className="cellnum xv-cell">{fmtUnit(r.xv, r.fob, unit, totals.xv)}</span></td>
        </tr>
      ))}
    </React.Fragment>
  );
}

function DesgloseProducto({ calidad, variedad }) {
  const [unit, setUnit] = useStateDesg("kg");
  const totals = { desp: colTotal(ALL_PROD, "desp"), comp: colTotal(ALL_PROD, "comp"), xv: colTotal(ALL_PROD, "xv") };
  const suf = unit === "kg" ? "KG" : unit === "usd" ? "USD FOB" : "% del total";

  // -------- calculadora --------
  const [matriz, setMatriz] = useStateDesg(MATRIZ_OPCIONES[0]);
  const [inputs, setInputs] = useStateDesg(() => {
    const o = {}; CALC_INPUTS.forEach(c => o[c.name] = c.def); return o;
  });
  const totalInput = CALC_INPUTS.reduce((s, c) => s + (inputs[c.name] || 0), 0);

  // pesos por producto = xv base * multiplicador de matriz
  const mult = MATRIZ_MULT[matriz];
  const weighted = ALL_PROD.map(p => {
    const grp = NCC_PROD.includes(p) ? "NCC" : "NSC";
    return { name: p.name, grp, base: p.xv, w: Math.max(p.xv, 1) * mult(p, grp) };
  });
  const wSum = weighted.reduce((s, x) => s + x.w, 0) || 1;
  const nuevoSaldo = {};
  weighted.forEach(x => { nuevoSaldo[x.name] = x.base + Math.round(totalInput * (x.w / wSum)); });

  const setInput = (name, val) => {
    const n = val === "" ? 0 : Math.max(0, parseInt(val.replace(/[^\d]/g, ""), 10) || 0);
    setInputs(p => ({ ...p, [name]: n }));
  };

  return (
    <div className="desglose-row" style={{ marginBottom: 16 }}>
      {/* ---------- Bloque 1: tabla ---------- */}
      <div className="card card-pad">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 className="section-title" style={{ fontSize: 15 }}>Desglose por Producto a Procesar</h3>
            <div style={{ display: "flex", gap: 7, marginTop: 9 }}>
              <span className="chip">Calidad: {calidad || "Todas"}</span>
              <span className="chip">Variedad: {variedad || "Todas"}</span>
            </div>
          </div>
          <UnitToggle value={unit} onChange={setUnit} />
        </div>
        <div style={{ overflow: "hidden" }}>
          <table className="t prod">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="num">Despachado</th>
                <th className="num">Comprometido</th>
                <th className="num">X Vender</th>
              </tr>
            </thead>
            <tbody>
              <ProductRows rows={NCC_PROD} grp="NCC" unit={unit} totals={totals} />
              <ProductRows rows={NSC_PROD} grp="NSC" unit={unit} totals={totals} />
              <tr className="total">
                <td className="var">Total general</td>
                <td className="num"><span className="cellnum">{fmtUnit(totals.desp, 0, unit === "usd" ? "kg" : unit, totals.desp)}{unit === "usd" ? "" : ""}</span></td>
                <td className="num"><span className="cellnum">{fmtUnit(totals.comp, 0, unit === "usd" ? "kg" : unit, totals.comp)}</span></td>
                <td className="num"><span className="cellnum xv-cell">{unit === "pct" ? "100.0%" : Math.round(totals.xv).toLocaleString("en-US")}</span></td>
              </tr>
            </tbody>
          </table>
          <div className="prod-foot">Valores en {suf}</div>
        </div>
      </div>

      {/* ---------- Bloque 2: calculadora ---------- */}
      <div className="card card-pad">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h3 className="section-title" style={{ fontSize: 15, whiteSpace: "nowrap" }}>Calculadora de Producto</h3>
            <div className="mini-sub" style={{ marginTop: 3 }}>Ingresa cantidades por calibre para ver el nuevo saldo X Vender</div>
          </div>
          <div className="select" style={{ minWidth: 200 }}>
            <select value={matriz} onChange={e => setMatriz(e.target.value)} aria-label="Matriz de Producto">
              {MATRIZ_OPCIONES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="calc-split">
          {/* INPUT */}
          <div className="calc-col">
            <div className="calc-colhead">Ingreso · Cantidad (KG)</div>
            <table className="calc-tbl">
              <thead><tr><th>Producto</th><th className="num">Cantidad</th></tr></thead>
              <tbody>
                {CALC_INPUTS.map(c => (
                  <tr key={c.name}>
                    <td className="var">{c.name}</td>
                    <td className="num">
                      <input className="calc-in" inputMode="numeric"
                        value={(inputs[c.name] || 0).toLocaleString("en-US")}
                        onChange={e => setInput(c.name, e.target.value)} />
                    </td>
                  </tr>
                ))}
                <tr className="total">
                  <td className="var">Total ingreso</td>
                  <td className="num"><span className="cellnum">{totalInput.toLocaleString("en-US")}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* OUTPUT */}
          <div className="calc-col">
            <div className="calc-colhead">KG Nuevo saldo X Vender</div>
            <table className="calc-tbl">
              <thead><tr><th>Producto</th><th className="num">Nuevo saldo</th></tr></thead>
              <tbody>
                <tr className="grp"><td colSpan={2}>NCC</td></tr>
                {NCC_PROD.map(p => {
                  const val = nuevoSaldo[p.name];
                  const neg = val < 0;
                  return (
                    <tr key={p.name}>
                      <td className="var">{p.name}</td>
                      <td className="num">
                        <span className="cellnum out-val" style={neg ? { color: "#c0392b", fontWeight: 600 } : {}}>
                          {neg ? "-" : ""}{Math.abs(val).toLocaleString("en-US")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="grp"><td colSpan={2}>NSC</td></tr>
                {NSC_PROD.map(p => {
                  const val = nuevoSaldo[p.name];
                  const neg = val < 0;
                  return (
                    <tr key={p.name}>
                      <td className="var">{p.name}</td>
                      <td className="num">
                        <span className="cellnum out-val" style={neg ? { color: "#c0392b", fontWeight: 600 } : {}}>
                          {neg ? "-" : ""}{Math.abs(val).toLocaleString("en-US")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="prod-foot">Saldo calculado según matriz “{matriz}” sobre el ingreso registrado.</div>
      </div>
    </div>
  );
}

Object.assign(window, { DesgloseProducto });
