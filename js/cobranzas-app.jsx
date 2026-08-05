/* ============ COBRANZAS · APP ============ */
const { useState: useStateCobApp } = React;

function CobranzasApp() {
  const [temporada, setTemporada] = useStateCobApp(TEMPORADAS_COB[0]);
  const [rango, setRango] = useStateCobApp(RANGOS_VENCIMIENTO_COB[1]);
  const [clientes, setClientes] = useStateCobApp([]);
  const [mercados, setMercados] = useStateCobApp([]);
  const [estado, setEstado] = useStateCobApp("Pendientes");
  const [moneda, setMoneda] = useStateCobApp(MONEDAS_COB[0]);

  const grilla = GRILLA_COBRANZAS_COB.filter(r =>
    (!clientes.length || clientes.includes(r.cliente))
  );

  return (
    <div className="app-shell" style={{ maxWidth: 1280 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 22 }}>Cobranzas</h1>
          <div className="mini-sub" style={{ marginTop: 4 }}>Vista de gestión · saldos pendientes, vencimientos, documentos y seguimiento de pago</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--green-deep)" }}>Valbifrut</div>
      </div>

      <CobranzasFilters
        temporada={temporada} setTemporada={setTemporada}
        rango={rango} setRango={setRango}
        clientes={clientes} setClientes={setClientes}
        mercados={mercados} setMercados={setMercados}
        estado={estado} setEstado={setEstado}
        moneda={moneda} setMoneda={setMoneda}
      />

      <AvisoEjemplo />

      <SectionEyebrow>Cobranza · resumen ejecutivo</SectionEyebrow>
      <div className="quad-grid" style={{ marginBottom: 16 }}>
        <SaldoTotalCard data={SALDO_TOTAL_COB} />
        <VencidoCard data={VENCIDO_COB} />
        <PorVencerCard data={POR_VENCER_COB} />
        <RecibidoMesCard data={RECIBIDO_MES_COB} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <AntiguedadSaldos rows={ANTIGUEDAD_SALDOS_COB} />
        <TopClientesPendientes rows={TOP_CLIENTES_PENDIENTES_COB} />
        <LineaCoface rows={LINEA_COFACE_COB} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <GrillaCobranzas rows={grilla} />
      </div>

      <CobranzasFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CobranzasApp />);
