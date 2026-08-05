/* ============ COBRANZAS · DATA & HELPERS ============ */

const TEMPORADAS_COB = ["2026", "2025"];
const RANGOS_VENCIMIENTO_COB = ["Próximos 7 días", "Próximos 30 días", "Todos"];
const ESTADOS_COBRANZA_COB = ["Pendientes", "Vencidos", "Por vencer", "Pagados", "Todos"];
const MONEDAS_COB = ["USD", "CLP"];
const MERCADOS_COB = ["India", "Italia", "Alemania", "Marruecos", "España", "Grecia"];

/* ---- 1-4. Resumen ejecutivo (KPIs fijos, montos de ejemplo) ---- */
const SALDO_TOTAL_COB = { total: 1186680, facturas: 42, noVencido: 933582, vencido: 253098 };
const VENCIDO_COB = { total: 253098, facturas: 7, participacion: 21.3, mayorTramo: "1-7 días" };
const POR_VENCER_COB = { total: 394542, facturas: 12, participacion: 33.2, ventana: "7 días" };
const RECIBIDO_MES_COB = { total: 534614, pagos: 9, promedio: 59402, moneda: "USD" };

/* ---- 5. Antigüedad de saldos ---- */
const ANTIGUEDAD_SALDOS_COB = [
  { tramo: "No vencido", monto: 933582, pct: 78.7 },
  { tramo: "1-7 días",   monto: 118400, pct: 10.0 },
  { tramo: "8-15 días",  monto: 74698,  pct: 6.3 },
  { tramo: "16-30 días", monto: 41000,  pct: 3.5 },
  { tramo: "+30 días",   monto: 19000,  pct: 1.6 },
];

/* ---- 6. Top clientes pendientes ---- */
const TOP_CLIENTES_PENDIENTES_COB = [
  { cliente: "Murano S.p.A.",       mercado: "Italia",     embarques: 4, saldo: 198000, badge: "3 venc.",  badgeTone: "danger" },
  { cliente: "Regional Walnut SARL", mercado: "Marruecos",  embarques: 2, saldo: 146000, badge: "vencido",  badgeTone: "danger" },
  { cliente: "Importaco Casa Pons",  mercado: "España",     embarques: 3, saldo: 121000, badge: "7 días",   badgeTone: "rest" },
  { cliente: "Mokias G. & Co.",      mercado: "Grecia",      embarques: 2, saldo: 96000,  badge: "12 días",  badgeTone: "rest" },
  { cliente: "Frit Ravich",          mercado: "España",     embarques: 1, saldo: 69000,  badge: "2 días",   badgeTone: "rest" },
];

/* ---- 7. Línea Coface ---- */
const LINEA_COFACE_COB = [
  { cliente: "Murano S.p.A.",        aprobada: 250000, usada: 238000 },
  { cliente: "Regional Walnut SARL", aprobada: 180000, usada: 168400 },
  { cliente: "Importaco C. Pons",    aprobada: 200000, usada: 176000 },
  { cliente: "Mokias G. & Co.",      aprobada: 120000, usada: 96400 },
  { cliente: "Frit Ravich",          aprobada: 150000, usada: 89000 },
  { cliente: "Seeberger GmbH",       aprobada: 400000, usada: 131418 },
].map(r => ({ ...r, libre: r.aprobada - r.usada, pctLibre: (r.aprobada - r.usada) / r.aprobada * 100 }))
  .sort((a, b) => a.pctLibre - b.pctLibre);

/* ---- Grilla de cobranzas ---- */
const GRILLA_COBRANZAS_COB = [
  { vence: "08-jul", urgencia: "+21 días", cliente: "Regional Walnut SARL",   embarque: "2026-4699", factura: "FV 4612", monto: 83200, pagado: 0,     condicion: "CAD",           documentos: "Pendiente", estadoEmbarque: "En tránsito", accion: "Solicitar confirmación de pago" },
  { vence: "10-jul", urgencia: "+19 días", cliente: "Balamoutsos Konstantinos", embarque: "2026-4768", factura: "FV 4630", monto: 91400, pagado: 0,   condicion: "CAD",           documentos: "Enviados",  estadoEmbarque: "Zarpado",     accion: "Esperar SWIFT / seguimiento" },
  { vence: "27-jul", urgencia: "+2 días",  cliente: "Importaco Casa Pons",     embarque: "2026-4702", factura: "FV 4631", monto: 78498, pagado: 20000, condicion: "30 días",       documentos: "Aprobados", estadoEmbarque: "En tránsito", accion: "Cliente revisando documentos" },
  { vence: "29-jul", urgencia: "Hoy",      cliente: "Frit Ravich",             embarque: "2026-4770", factura: "FV 4640", monto: 69120, pagado: 0,     condicion: "CAD",           documentos: "Falta BL",  estadoEmbarque: "Despachado",  accion: "Enviar BL / certificados" },
  { vence: "01-ago", urgencia: "3 días",   cliente: "Murano S.p.A.",           embarque: "2026-4744", factura: "FV 4648", monto: 72324, pagado: 0,     condicion: "CAD",           documentos: "Pendiente", estadoEmbarque: "Despachado",  accion: "Confirmar fecha de pago" },
  { vence: "03-ago", urgencia: "5 días",   cliente: "Mokias G. & Co.",         embarque: "2026-4766", factura: "FV 4651", monto: 66600, pagado: 0,     condicion: "CAD",           documentos: "Enviados",  estadoEmbarque: "Zarpado",     accion: "Confirmar recepción de documentos" },
  { vence: "07-ago", urgencia: "9 días",   cliente: "Vitality Nuts and Spices", embarque: "2026-4773", factura: "FV 4658", monto: 86400, pagado: 0,   condicion: "Anticipo + CAD", documentos: "Aprobados", estadoEmbarque: "En tránsito", accion: "Preparar cobro de saldo final" },
];
GRILLA_COBRANZAS_COB.forEach(r => { r.saldo = r.monto - r.pagado; });

const CLIENTES_COB = [...new Set(GRILLA_COBRANZAS_COB.map(r => r.cliente).concat(TOP_CLIENTES_PENDIENTES_COB.map(r => r.cliente)))].sort();

Object.assign(window, {
  TEMPORADAS_COB, RANGOS_VENCIMIENTO_COB, ESTADOS_COBRANZA_COB, MONEDAS_COB, MERCADOS_COB, CLIENTES_COB,
  SALDO_TOTAL_COB, VENCIDO_COB, POR_VENCER_COB, RECIBIDO_MES_COB,
  ANTIGUEDAD_SALDOS_COB, TOP_CLIENTES_PENDIENTES_COB, LINEA_COFACE_COB, GRILLA_COBRANZAS_COB,
});
