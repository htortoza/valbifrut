/* ============ LOWER SECTIONS ============ */

const FLUJO = [
  { c: "Stock Inicial",    v: "2,450",  cls: "" },
  { c: "Ingreso Cosecha",  v: "+1,200", cls: "pos" },
  { c: "Comprometido",     v: "-840",   cls: "neg" },
  { c: "Despachado YTD",   v: "-1,100", cls: "" },
  { c: "Mermas/Ajustes",   v: "-12",    cls: "" },
];

function FlujoStock() {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Flujo de Stock (TN)</h3>
        <span className="eyebrow" style={{ color: "var(--green-text)" }}>Tiempo Real</span>
      </div>
      <table className="t">
        <thead><tr><th>Concepto</th><th className="num">Cant.</th></tr></thead>
        <tbody>
          {FLUJO.map(r => (
            <tr key={r.c}>
              <td>{r.c}</td>
              <td className="num"><span className={"cellnum " + r.cls}>{r.v}</span></td>
            </tr>
          ))}
          <tr style={{ background: "var(--green-lighter)" }}>
            <td style={{ fontWeight: 700, color: "var(--green-deep)", borderRadius: "8px 0 0 8px", paddingLeft: 10 }}>Stock Disponible</td>
            <td className="num" style={{ borderRadius: "0 8px 8px 0", paddingRight: 10 }}><span className="cellnum" style={{ color: "var(--green-deep)" }}>1,698</span></td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 18 }}>
        <div className="flujo-bar"><span style={{ width: "65%" }}></span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9 }}>
          <span className="eyebrow">Capacidad Silos</span>
          <span className="eyebrow">65% Utilizado</span>
        </div>
      </div>
    </div>
  );
}

function SalesChart() {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <h3 className="section-title" style={{ fontSize: 15 }}>Evolución de Ventas vs Histórico</h3>
          <div className="chart-legend" style={{ marginTop: 12 }}>
            <span className="li"><span className="dot" style={{ background: "var(--green)" }}></span>Proyección 2026</span>
            <span className="li"><span className="dash"></span>Años anteriores</span>
          </div>
        </div>
        <span style={{ color: "var(--muted-2)", fontSize: 18, letterSpacing: 2 }}>⋮</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <AnnualBars data={VENTAS_ANUALES} />
      </div>
      <div className="mini-sub" style={{ textAlign: "center", marginTop: 4 }}>Volumen anual (TN) — comparación interanual</div>
    </div>
  );
}

function CuotaCard() {
  return (
    <div className="card card-pad donut-wrap">
      <div className="eyebrow" style={{ marginBottom: 18 }}>Cuota de Mercado</div>
      <Donut pct={68} color="var(--green)" center={
        <React.Fragment>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>68%</div>
          <div className="eyebrow" style={{ fontSize: 9 }}>Core Top</div>
        </React.Fragment>} />
      <div className="legend">
        <span className="li"><span className="dot" style={{ background: "var(--green)" }}></span>Europa</span>
        <span className="li"><span className="dot" style={{ background: "#d6dade" }}></span>Resto</span>
      </div>
    </div>
  );
}

function DesgloseCard() {
  return (
    <div className="card card-pad donut-wrap">
      <div className="eyebrow" style={{ marginBottom: 18 }}>Desglose NCC vs NSC</div>
      <Donut pct={76} size={108} stroke={13} color="var(--green-mint)" center={
        <React.Fragment>
          <div style={{ fontSize: 21, fontWeight: 800, color: "var(--ink)" }}>76%</div>
          <div className="eyebrow" style={{ fontSize: 9 }}>NCC</div>
        </React.Fragment>} />
    </div>
  );
}

function VolPaises() {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 className="section-title" style={{ fontSize: 15 }}>Evolución de Volumen por Países Top</h3>
        <div className="chart-legend">
          <span className="li"><span className="dot" style={{ background: "#15a04a" }}></span>ALE</span>
          <span className="li"><span className="dot" style={{ background: "#7fdd9c" }}></span>BRA</span>
          <span className="li"><span className="dot" style={{ background: "#9aa1a8" }}></span>KOR</span>
        </div>
      </div>
      <LineChart data={VOL_PAISES} />
    </div>
  );
}

function MercadoTable({ unit }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 16 }}>
      <h3 className="section-title" style={{ marginBottom: 22 }}>Desempeño por Mercado</h3>
      <table className="big">
        <thead>
          <tr>
            <th>País</th>
            <th>Volumen (TN)</th>
            <th>Facturación (USD)</th>
            <th className="ctr">Cant. Pedidos</th>
            <th className="ctr">Var. vs Ant.</th>
            <th className="ctr">Participación</th>
            <th className="num">Precio Prom.</th>
          </tr>
        </thead>
        <tbody>
          {MERCADOS.map(m => (
            <tr key={m.pais}>
              <td className="strong">{m.pais}</td>
              <td>{m.vol.toLocaleString("en-US")} TN</td>
              <td>{fmtUsdFull(m.fact)}</td>
              <td className="ctr strong">{m.pedidos}</td>
              <td className="ctr"><span className="pill-up">{m.delta}</span></td>
              <td className="ctr" style={{ color: "var(--muted)" }}>{m.part}%</td>
              <td className="num" style={{ color: "var(--muted)" }}>{m.precio.toFixed(2)} $</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Panorama() {
  const [mode, setMode] = useState("vol");
  const sorted = [...COMPETIDORES].sort((a, b) =>
    mode === "vol" ? b.part - a.part : b.precio - a.precio);
  const maxPrecio = Math.max(...COMPETIDORES.map(c => c.precio), 2.12);
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h3 className="section-title">Panorama Competitivo</h3>
          <div className="eyebrow" style={{ marginTop: 5 }}>Benchmark vs Industria (ASOEX)</div>
        </div>
        <div className="viewtabs" style={{ margin: 0 }}>
          <div className="seg">
            <button className={mode === "vol" ? "active" : ""} onClick={() => setMode("vol")}>Por Volumen</button>
            <button className={mode === "fact" ? "active" : ""} onClick={() => setMode("fact")}>Por Facturación</button>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
        <table className="big">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Exportadora</th>
              <th>Participación (%)</th>
              <th className="num">Precio Promedio (USD)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr key={c.exp}>
                <td className="strong">{i + 1}</td>
                <td className={c.propio ? "strong" : ""}>{c.exp}</td>
                <td className={c.propio ? "pill-up" : ""}>{c.part.toFixed(1)}%</td>
                <td className="num">${c.precio.toFixed(2)} USD</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <div className="eyebrow" style={{ marginBottom: 22 }}>Comparativa Precio Promedio</div>
          <div className="cmp-row">
            <div className="cmp-top">
              <span className="cmp-label">Nuestra Empresa</span>
              <span className="cmp-val" style={{ color: "var(--green-text)" }}>$2.28 USD</span>
            </div>
            <div className="cmp-track"><span style={{ width: (2.28/maxPrecio*100)+"%", background: "var(--green)" }}></span></div>
          </div>
          <div className="cmp-row">
            <div className="cmp-top">
              <span className="cmp-label">ASOEX (Industria)</span>
              <span className="cmp-val" style={{ color: "var(--muted)" }}>$2.12 USD</span>
            </div>
            <div className="cmp-track"><span style={{ width: (2.12/maxPrecio*100)+"%", background: "#cfd4d9" }}></span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FlujoStock, SalesChart, CuotaCard, DesgloseCard, VolPaises, MercadoTable, Panorama });
