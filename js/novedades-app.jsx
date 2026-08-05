/* ============ NOVEDADES COMERCIALES · APP ============ */
const { useState: useStateNovApp } = React;

function NovedadesApp() {
  const [temporada, setTemporada] = useStateNovApp(TEMPORADAS_NOV[0]);
  const [rango, setRango] = useStateNovApp(RANGOS_NOV[0]);
  const [clientes, setClientes] = useStateNovApp([]);
  const [mercados, setMercados] = useStateNovApp([]);
  const [prodvar, setProdvar] = useStateNovApp([]);

  const pasaCliente = c => !clientes.length || clientes.includes(c);
  const pasaMercado = m => !mercados.length || mercados.includes(m);
  const pasaProdVar = texto => !prodvar.length || prodvar.some(p => texto.includes(p));

  const contratos = NUEVOS_CONTRATOS_NOV.filter(r => pasaCliente(r.cliente) && pasaMercado(r.mercado));
  const despachados = EMBARQUES_DESPACHADOS_NOV.filter(r => pasaCliente(r.cliente) && pasaProdVar(r.producto));

  return (
    <div className="app-shell" style={{ maxWidth: 1280 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 22 }}>Novedades Comerciales</h1>
          <div className="mini-sub" style={{ marginTop: 4 }}>Vista ejecutiva semanal · contratos nuevos, kilos de temporada y despachos recientes</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-deep)" }}>Valbifrut</div>
      </div>

      <NovedadesFilters
        temporada={temporada} setTemporada={setTemporada}
        rango={rango} setRango={setRango}
        clientes={clientes} setClientes={setClientes}
        mercados={mercados} setMercados={setMercados}
        prodvar={prodvar} setProdvar={setProdvar}
      />

      <SectionEyebrow>Ventas · novedades comerciales</SectionEyebrow>
      <div className="quad-grid" style={{ marginBottom: 16 }}>
        <ContratosCard rows={contratos} />
        <KilosTemporadaCard rows={KILOS_TEMPORADA_NOV} avance={AVANCE_EQQCC_NOV} />
        <VentaCard data={VENTA_NOV} />
        <EmbarquesResumenCard data={EMBARQUES_NOV} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <TopMercados data={TOP_MERCADOS_NOV} totalKg={TOP_MERCADOS_KG_NOV} totalUsd={TOP_MERCADOS_USD_NOV} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <UltimosDespachados rows={despachados} />
      </div>

      <NovedadesFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<NovedadesApp />);
