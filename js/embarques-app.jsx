/* ============ EMBARQUES · APP ============ */
const { useState: useStateEmbApp } = React;

function detalleDe(row) {
  if (!row) return null;
  if (row.emb === DETALLE_SELECCIONADO_EMB.emb) return DETALLE_SELECCIONADO_EMB;
  return {
    ...row, estadoBadge: estadoDeRow(row), ultimaActualizacion: "—",
    contenedor: null, booking: null, tipoContenedor: null, naviera: null, nave: null, puertoSalida: null,
    pagos: { total: row.monto, pagado: null, saldo: null },
    condicionPago: null, vencimientoPago: null,
    documentos: { factura: null, bl: false, packingList: false, certOrigen: false },
    aviso: null,
    gestion: { responsable: "Comex", proximaAccion: "—", ultimaActualizacion: "—" },
  };
}

function EmbarquesSection() {
  const [temporada, setTemporada] = useStateEmbApp(TEMPORADAS_EMB[0]);
  const [clientes, setClientes] = useStateEmbApp([]);
  const [contrato, setContrato] = useStateEmbApp("Todos");
  const [prodvar, setProdvar] = useStateEmbApp([]);
  const [destino, setDestino] = useStateEmbApp("Todos");
  const [estado, setEstado] = useStateEmbApp("Todos");
  const [busqueda, setBusqueda] = useStateEmbApp("");
  const [selected, setSelected] = useStateEmbApp(
    GRILLA_EMBARQUES_EMB.find(r => r.seleccionado).emb
  );

  const q = busqueda.trim().toLowerCase();
  const rows = GRILLA_EMBARQUES_EMB.filter(r => {
    if (clientes.length && !clientes.includes(r.cliente)) return false;
    if (contrato !== "Todos" && r.contrato !== contrato) return false;
    if (prodvar.length && !prodvar.includes(r.producto) && !prodvar.includes(r.variedad)) return false;
    if (destino !== "Todos" && (r.mercado + " · " + r.destino) !== destino) return false;
    if (estado !== "Todos" && estadoDeRow(r) !== estado && !estadoDeRow(r).startsWith(estado)) return false;
    if (q && !(r.emb + r.cliente + r.contrato + r.producto).toLowerCase().includes(q)) return false;
    return true;
  });

  const selectedRow = rows.find(r => r.emb === selected) || GRILLA_EMBARQUES_EMB.find(r => r.emb === selected);
  const detalle = detalleDe(selectedRow);

  return (
    <div>
      <h2 className="section-title" style={{ fontSize: 19 }}>Embarques</h2>
      <div className="mini-sub" style={{ marginTop: 4, marginBottom: 18 }}>Vista maestra de seguimiento · embarques, contratos, logística, pagos y documentos</div>

      <EmbarquesFilters
        temporada={temporada} setTemporada={setTemporada}
        clientes={clientes} setClientes={setClientes}
        contrato={contrato} setContrato={setContrato}
        prodvar={prodvar} setProdvar={setProdvar}
        destino={destino} setDestino={setDestino}
        estado={estado} setEstado={setEstado}
        busqueda={busqueda} setBusqueda={setBusqueda}
      />

      <SectionEyebrow>Seguimiento general de embarques</SectionEyebrow>
      <div style={{ marginBottom: 16 }}>
        <GrillaEmbarques rows={rows} selected={selected} onSelect={setSelected} />
      </div>

      {detalle && (
        <div style={{ marginBottom: 8 }}>
          <DetalleEmbarque d={detalle} onClose={() => setSelected(null)} />
        </div>
      )}

      <EmbarquesFooter />
    </div>
  );
}
