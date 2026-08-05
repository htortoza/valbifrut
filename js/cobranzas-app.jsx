/* ============ COBRANZAS · APP ============ */
const { useState: useStateCobApp } = React;

function CobranzasSection() {
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
    <div>
      <h2 className="section-title" style={{ fontSize: 19 }}>Cobranzas</h2>
      <div className="mini-sub" style={{ marginTop: 4, marginBottom: 18 }}>Vista de gestión · saldos pendientes, vencimientos, documentos y seguimiento de pago</div>

      <CobranzasFilters
        temporada={temporada} setTemporada={setTemporada}
        rango={rango} setRango={setRango}
        clientes={clientes} setClientes={setClientes}
        mercados={mercados} setMercados={setMercados}
        estado={estado} setEstado={setEstado}
        moneda={moneda} setMoneda={setMoneda}
      />

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
