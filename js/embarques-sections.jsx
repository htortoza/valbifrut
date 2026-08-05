/* ============ EMBARQUES · SECTIONS ============ */
const { useState: useStateEmb } = React;

/* ---- top filter bar (6 selects + búsqueda rápida) ---- */
function EmbarquesFilters({ temporada, setTemporada, clientes, setClientes, contrato, setContrato,
  prodvar, setProdvar, destino, setDestino, estado, setEstado, busqueda, setBusqueda }) {
  return (
    <div className="card filters-embarques">
      <div className="filter">
        <label>Temporada</label>
        <div className="select"><select value={temporada} onChange={e => setTemporada(e.target.value)}>
          {TEMPORADAS_EMB.map(t => <option key={t} value={t}>{t}</option>)}
        </select></div>
      </div>
      <MultiSel label="Cliente" options={CLIENTES_EMB} selected={clientes} onChange={setClientes} />
      <div className="filter">
        <label>Contrato</label>
        <div className="select"><select value={contrato} onChange={e => setContrato(e.target.value)}>
          <option value="Todos">Todos</option>
          {CONTRATOS_EMB.map(c => <option key={c} value={c}>{c}</option>)}
        </select></div>
      </div>
      <MultiSel label="Producto / Variedad" options={PRODVAR_OPCIONES_EMB} selected={prodvar} onChange={setProdvar} />
      <div className="filter">
        <label>País / Puerto destino</label>
        <div className="select"><select value={destino} onChange={e => setDestino(e.target.value)}>
          <option value="Todos">Todos</option>
          {PAISES_PUERTO_EMB.map(p => <option key={p} value={p}>{p}</option>)}
        </select></div>
      </div>
      <div className="filter">
        <label>Estado</label>
        <div className="select"><select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          {ESTADOS_EMB.map(e => <option key={e} value={e}>{e}</option>)}
        </select></div>
      </div>
      <div className="filter" style={{ gridColumn: "span 2" }}>
        <label>Búsqueda rápida</label>
        <input className="search-input" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Embarque, cliente, contrato, booking, contenedor, nave..." />
      </div>
    </div>
  );
}

function estadoDeRow(row) {
  const s = row.steps;
  if (s[4].done) return "Finalizado";
  if (s[3].done) return "Pagado";
  if (s[2].done) return "Arribado";
  if (s[2].current) return "En tránsito";
  if (s[1].done) return "Zarpado";
  if (s[0].done) return "Despachado";
  return "Programado" + (row.progSemana ? " · " + row.progSemana : "");
}

/* ---- Grilla de embarques ---- */
function GrillaEmbarques({ rows, selected, onSelect }) {
  const [vista, setVista] = useStateEmb("embarque");

  if (vista === "contrato") {
    const porContrato = {};
    rows.forEach(r => {
      (porContrato[r.contrato] = porContrato[r.contrato] || { contrato: r.contrato, cliente: r.cliente, embarques: 0, kg: 0, primerEmb: r.emb }).embarques++;
      porContrato[r.contrato].kg += r.kg;
    });
    const grupos = Object.values(porContrato);
    return (
      <InfoCard title="Grilla de embarques" tag={rows.length + " embarques · temporada 2026"}
        sub="Vista por contrato: una fila por contrato, agrupando sus embarques.">
        <div className="viewtabs" style={{ justifyContent: "flex-start", marginBottom: 14 }}>
          <div className="seg">
            <button className={vista === "embarque" ? "active" : ""} onClick={() => setVista("embarque")}>Por embarque</button>
            <button className="active">Por contrato</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <button className="btn btn-ghost">Actualizar</button>
            <button className="btn btn-green">{Icon.save}Exportar</button>
          </div>
        </div>
        <table className="t">
          <thead><tr><th>Contrato</th><th>Cliente</th><th className="num">Embarques</th><th className="num">Kg total</th></tr></thead>
          <tbody>
            {grupos.map(g => (
              <tr key={g.contrato} style={{ cursor: "pointer" }} onClick={() => onSelect(g.primerEmb)}>
                <td className="var">{g.contrato}</td>
                <td>{g.cliente}</td>
                <td className="num">{g.embarques}</td>
                <td className="num"><span className="cellnum">{g.kg.toLocaleString("en-US")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>
    );
  }

  return (
    <InfoCard title="Grilla de embarques" tag={rows.length + " embarques · temporada 2026"}
      sub="Vista por defecto: una fila por embarque correlativo, cada fila agrupa sus embarques y despliega una subgrilla con contenedor, booking, ETD, ETA y estado.">
      <div className="viewtabs" style={{ justifyContent: "flex-start", marginBottom: 14 }}>
        <div className="seg">
          <button className="active">Por embarque</button>
          <button onClick={() => setVista("contrato")}>Por contrato</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <button className="btn btn-ghost">Actualizar</button>
          <button className="btn btn-green">{Icon.save}Exportar</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="big">
          <thead>
            <tr>
              <th>Emb. / Contrato</th><th>Cliente</th><th>Producto / Kg</th><th>Destino / Fechas</th><th>Estado del embarque</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.emb} onClick={() => onSelect(r.emb)}
                style={{ cursor: "pointer", background: selected === r.emb ? "var(--green-lighter)" : "transparent" }}>
                <td>
                  <div className="strong">{r.emb}</div>
                  <div className="mini-sub">Contrato {r.contrato}</div>
                </td>
                <td>
                  <div>{r.cliente}</div>
                  <div className="mini-sub">{r.incoterm} · {r.mercado}</div>
                </td>
                <td>
                  <div>{r.producto} · {r.variedad}</div>
                  <div className="mini-sub">{r.kg.toLocaleString("en-US")} kg{r.monto ? " · " + fmtUsdFull(r.monto) : ""}</div>
                </td>
                <td>
                  <div>{r.destino}</div>
                  <div className="mini-sub">ETD {r.etd} · ETA {r.eta}{r.etaActualizada ? " · act. " + r.etaActualizada : ""}</div>
                </td>
                <td><Stepper steps={r.steps} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mini-sub" style={{ marginTop: 12 }}>
        Mostrando {rows.length} de 272 embarques · fila destacada = embarque seleccionado
      </div>
      <div className="mini-sub" style={{ marginTop: 4 }}>
        Estados "Pagado" y "Cont. devuelto" quedarán activos cuando se integren pagos y devolución de unidades.
      </div>
    </InfoCard>
  );
}

/* ---- Detalle del embarque seleccionado ---- */
function DocDetChip({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{label}</span>
      {value === true
        ? <span className="tag tag-done">Disponible</span>
        : typeof value === "string"
          ? <span className="tag tag-done">{value}</span>
          : <span className="chip">sin registro</span>}
    </div>
  );
}

function DetalleEmbarque({ d, onClose }) {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 className="section-title" style={{ fontSize: 17 }}>Embarque {d.emb}</h3>
          <span className="tag tag-comp">{d.estadoBadge}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mini-sub">Última actualización sistema · {d.ultimaActualizacion}</span>
          <button className="xclose" onClick={onClose}>✕</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Datos principales y logísticos</div>
          <table className="t">
            <tbody>
              <tr><td>Contrato</td><td className="num">{d.contrato}</td></tr>
              <tr><td>Cliente</td><td className="num">{d.cliente}</td></tr>
              <tr><td>Producto</td><td className="num">{d.producto}</td></tr>
              <tr><td>Variedad</td><td className="num">{d.variedad}</td></tr>
              <tr><td>Kilos</td><td className="num">{d.kg.toLocaleString("en-US")} kg</td></tr>
              <tr><td>Monto / Incoterm</td><td className="num">{d.monto ? fmtUsdFull(d.monto) : "—"} · {d.incoterm}</td></tr>
              <tr><td>Contenedor</td><td className="num">{d.contenedor || "—"}</td></tr>
              <tr><td>Booking</td><td className="num">{d.booking || "—"}</td></tr>
              <tr><td>Tipo contenedor</td><td className="num">{d.tipoContenedor || "—"}</td></tr>
              <tr><td>Naviera / nave</td><td className="num">{d.naviera ? d.naviera + " · " + d.nave : "—"}</td></tr>
              <tr><td>Puerto salida</td><td className="num">{d.puertoSalida || "—"}</td></tr>
              <tr><td>Destino</td><td className="num">{d.destino}</td></tr>
              <tr><td>ETD</td><td className="num">{d.etd}</td></tr>
              <tr><td>ETA · ETA actualizada</td><td className="num">{d.eta}{d.etaActualizada ? " · " + d.etaActualizada : ""}</td></tr>
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Pagos</div>
              <div className="kpi-row">
                <div className="kpi-stat"><div className="kpi-label">Total</div><div className="kpi-value" style={{ fontSize: 15 }}>{d.pagos.total ? fmtUsdFull(d.pagos.total) : "—"}</div></div>
                <div className="kpi-stat"><div className="kpi-label">Pagado</div><div className="kpi-value" style={{ fontSize: 15 }}>{d.pagos.pagado ? fmtUsdFull(d.pagos.pagado) : "—"}</div></div>
                <div className="kpi-stat"><div className="kpi-label">Saldo</div><div className="kpi-value" style={{ fontSize: 15 }}>{d.pagos.saldo ? fmtUsdFull(d.pagos.saldo) : "—"}</div></div>
              </div>
              <DocDetChip label="Condición de pago" value={d.condicionPago} />
              <DocDetChip label="Vencimiento · estado de pago" value={d.vencimientoPago} />
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Documentos</div>
              <DocDetChip label="Factura" value={d.documentos.factura} />
              <DocDetChip label="BL / SWB" value={d.documentos.bl} />
              <DocDetChip label="Packing list" value={d.documentos.packingList} />
              <DocDetChip label="Cert. origen · QC · fumigación" value={d.documentos.certOrigen} />
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Estado del seguimiento</div>
          <Stepper steps={d.steps} size="lg" />
          <div className="mini-sub" style={{ marginTop: 14 }}>La línea resume el estado operativo del embarque; el detalle permite revisar fechas, documentos, pago y logística sin abrir la planilla.</div>
          {d.aviso && (
            <div className="hint" style={{ marginTop: 14, background: "#fdf3e3", border: "1px solid #f0d9a8", borderRadius: 10, padding: "10px 14px", color: "#8a6415" }}>
              ⚠ {d.aviso}
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Gestión</div>
            <table className="t">
              <tbody>
                <tr><td>Responsable</td><td className="num">{d.gestion.responsable}</td></tr>
                <tr><td>Próxima acción</td><td className="num">{d.gestion.proximaAccion}</td></tr>
                <tr><td>Última actualización</td><td className="num">{d.gestion.ultimaActualizacion}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmbarquesFooter() {
  return (
    <div className="mini-sub" style={{ textAlign: "center", marginTop: 8, marginBottom: 30 }}>
      Vista · Embarques · Valbifrut · datos planilla portal Comex al 29/07/2026
    </div>
  );
}

Object.assign(window, {
  EmbarquesFilters, estadoDeRow, GrillaEmbarques, DocDetChip, DetalleEmbarque, EmbarquesFooter,
});
