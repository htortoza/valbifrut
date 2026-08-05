/* ============ COMEX DATA & HELPERS ============ */

// Semana 31 comienza el lunes 27-jul-2026 (ancla real de la planilla)
const WEEK_ANCHOR_N_COMEX = 31;
const WEEK_ANCHOR_DATE_COMEX = new Date(2026, 6, 27);
function weekStartComex(n) { return addDaysComex(WEEK_ANCHOR_DATE_COMEX, (n - WEEK_ANCHOR_N_COMEX) * 7); }
function addDaysComex(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function isoComex(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function fmtDiaCorto(d) { return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }); }
const DIAS_SEMANA_COMEX = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const MESES_COMEX = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// fecha de una fila de grilla (o null si aún no tiene carga planificada)
function fechaFila(row) {
  if (row.semana == null || row.dow == null) return null;
  return addDaysComex(weekStartComex(row.semana), row.dow);
}
function fmtFCarga(row) {
  const f = fechaFila(row);
  return f ? "S" + row.semana + " (" + fmtDiaCorto(f) + ")" : "—";
}

const SEMANA_ACTUAL_COMEX = 31;
const HOY_COMEX = addDaysComex(weekStartComex(SEMANA_ACTUAL_COMEX), 2); // miércoles 29-jul-2026

const TEMPORADAS_COMEX = ["2026", "2025"];
const MESES_OPERATIVOS_COMEX = ["Junio 2026", "Julio 2026", "Agosto 2026"];
const SEMANA_RANGOS_COMEX = ["S.24 – S.27", "S.28 – S.31", "S.32 – S.35"];

const TIPOS_PRODUCTO_COMEX = [
  "80% Halves EL/L", "70% Halves EL/L", "20% Halves EL/L", "Large Pieces EL/L", "Medium Pieces EL/L",
  "Inshell 30/34", "Inshell 34/36", "Inshell 36+", "Inshell +30", "Inshell 30/32", "Inshell 32/34", "Industrial",
];
const PRODVAR_OPCIONES_COMEX = VARIEDADES.map(v => v.name).concat(TIPOS_PRODUCTO_COMEX);

const ESTADOS_COMEX = [
  { key: "ok",           label: "Reserva OK",     cls: "tag-done" },
  { key: "porConfirmar", label: "Por confirmar",  cls: "tag-rest" },
  { key: "produccion",   label: "En producción",  cls: "tag-comp" },
  { key: "despachado",   label: "Despachado",     cls: "tag-done" },
];
function estadoInfo(key) { return ESTADOS_COMEX.find(e => e.key === key) || null; }

const VISTAS_GRILLA_COMEX = [
  { key: "planMes",      label: "Planificado mes" },
  { key: "produccion",   label: "En producción" },
  { key: "sinPlan",      label: "Producido sin planificación" },
  { key: "despachados",  label: "Despachados" },
];

/* ---- 1. Embarques comprometidos (KPI fijo, nivel temporada) ---- */
const EMBARQUES_COMPROMETIDOS_COMEX = { total: 272, despachados: 158, porDespachar: 114, transito: 59 };

/* ---- 2. Capacidad planta / stock (KPI fijo, nivel planta) ---- */
const CAPACIDAD_PLANTA_COMEX = {
  sub: "Planta Buin · ocupación y stock disponible para planificar cargas.",
  pctOcupacion: 78, stockDisponible: 320000, capacidadUtilizada: 546000, capacidadDisponible: 154000,
};

/* ---- 3. Documentos de embarque (KPI fijo) ---- */
const DOCUMENTOS_EMBARQUE_COMEX = {
  sub: "114 embarques con seguimiento documental activo.",
  disponibles: 67, enviados: 5, sinRegistro: 42, aprobados: null,
  nota: "Estado \"aprobado\" aún no se registra por documento.",
};

/* ---- 4. Próximas naves / zarpes (KPI fijo) ---- */
const NAVES_PROXIMAS_COMEX = {
  sub: "Derivado de bookings vigentes; anticipar BL, certificados y tracking.",
  rows: [
    { fecha: "02-ago", nave: "MSC Cameroon",  puerto: "Valparaíso",  emb: 3 },
    { fecha: "05-ago", nave: "Ever Lissome",  puerto: "Valparaíso",  emb: 5 },
    { fecha: "07-ago", nave: "Wan Hai A17",   puerto: "San Antonio", emb: 1 },
  ],
};

/* ---- 5. Despachos por semana (histórico completo + semana en curso) ---- */
const DESPACHOS_RECIENTES_COMEX = [
  { semana: 24, cantidad: 11 }, { semana: 25, cantidad: 14 }, { semana: 26, cantidad: 9 },
  { semana: 27, cantidad: 16 }, { semana: 28, cantidad: 12 }, { semana: 29, cantidad: 7 },
  { semana: 30, cantidad: 13 }, { semana: 31, cantidad: 6, actual: true },
];
const DESPACHOS_SEMANA_COMEX = Array.from({ length: 23 }, (_, i) => {
  const n = i + 1;
  const cantidad = Math.max(1, 6 + Math.round(4 * Math.sin(i / 3.2)));
  return { semana: n, cantidad };
}).concat(DESPACHOS_RECIENTES_COMEX).map(d => ({ ...d, label: "S." + d.semana, kg: d.cantidad * 18000 }));

/* ---- 6. Stacking por destino (KPI fijo) ---- */
const STACKING_DESTINOS_COMEX = [
  { destino: "India",         ventana: "Vie 31/07 – Mar 04/08", emb: 8 },
  { destino: "Europa",        ventana: "Lun 03/08 – Mié 05/08", emb: 4 },
  { destino: "Marruecos",     ventana: "Mar 04/08 – Jue 06/08", emb: 2 },
  { destino: "Latinoamérica", ventana: "Jue 06/08 – Sáb 08/08", emb: 3 },
];

/* ---- 7/8. Grilla de planificación (fuente única: grilla + calendario) ---- */
const GRILLA_PLANIFICACION_COMEX = [
  // Planificado mes (mezcla de estados — tal como en la planilla)
  { id: 1,  embarque: "2026-4705", cliente: "Importaco Casa Pons",   producto: "80% Halves EL/L", variedad: "Chandler", kgSol: 18060, kgDesp: null, pct: 100, stacking: "03/08–05/08", zarpe: "05-ago", semana: 31, dow: 2, hora: "08:30", estado: "ok",           vista: "planMes" },
  { id: 2,  embarque: "2026-4623", cliente: "Daanhouwer & Co.",      producto: "Large Pieces EL/L", variedad: "Chandler", kgSol: 21168, kgDesp: null, pct: 97,  stacking: "03/08–05/08", zarpe: "05-ago", semana: 31, dow: 3, hora: "08:30", estado: "ok",           vista: "planMes" },
  { id: 3,  embarque: "2026-4832", cliente: "Rich Valley Dryfruit",  producto: "Inshell 30/34",   variedad: "Chandler", kgSol: 18000, kgDesp: null, pct: 100, stacking: "31/07–04/08", zarpe: "05-ago", semana: 31, dow: 0, hora: "08:30", estado: "ok",           vista: "planMes" },
  { id: 4,  embarque: "2026-4700", cliente: "Regional Walnut SARL",  producto: "Inshell +30",     variedad: "Serr",     kgSol: 23000, kgDesp: null, pct: 100, stacking: "04/08–06/08", zarpe: null,     semana: 31, dow: 4, hora: "12:00", estado: "porConfirmar", vista: "planMes" },
  { id: 5,  embarque: "2026-4849", cliente: "Bioalimentos Cía.",     producto: "Medium Pieces EL/L", variedad: "Chandler", kgSol: 24864, kgDesp: null, pct: 35, stacking: "06/08–08/08", zarpe: null,     semana: 32, dow: 5, hora: "12:00", estado: "produccion",  vista: "planMes" },
  { id: 6,  embarque: "2026-4829", cliente: "Madi Ventura SpA",      producto: "70% Halves EL/L",  variedad: "Chandler", kgSol: 17640, kgDesp: null, pct: 60,  stacking: "03/08–05/08", zarpe: null,     semana: 32, dow: 2, hora: "12:00", estado: "produccion",  vista: "planMes" },
  { id: 7,  embarque: "2026-4837", cliente: "Rich Valley Dryfruit",  producto: "Inshell 34/36",   variedad: "Chandler", kgSol: 19500, kgDesp: null, pct: 100, stacking: "01/08–03/08", zarpe: "03-ago", semana: 31, dow: 1, hora: "13:30", estado: "ok",           vista: "planMes" },
  { id: 8,  embarque: "2026-4808", cliente: "Murano S.p.A.",        producto: "20% Halves EL/L", variedad: "Chandler", kgSol: 15200, kgDesp: null, pct: 100, stacking: "02/08–04/08", zarpe: "04-ago", semana: 31, dow: 2, hora: "14:00", estado: "ok",           vista: "planMes" },
  { id: 9,  embarque: "2026-4790", cliente: "Vitality Nuts and Spices", producto: "Inshell 30/34", variedad: "Chandler", kgSol: 18500, kgDesp: null, pct: 100, stacking: "04/08–06/08", zarpe: "06-ago", semana: 31, dow: 3, hora: "13:30", estado: "ok",           vista: "planMes" },
  { id: 10, embarque: "2026-4793", cliente: "Vitality Nuts and Spices", producto: "Inshell 36+",  variedad: "Chandler", kgSol: 16800, kgDesp: null, pct: 100, stacking: "05/08–07/08", zarpe: "07-ago", semana: 31, dow: 4, hora: "10:30", estado: "ok",           vista: "planMes" },
  { id: 11, embarque: "2026-4787", cliente: "Vitality Nuts and Spices", producto: "Inshell 30/34", variedad: "Chandler", kgSol: 18000, kgDesp: null, pct: 100, stacking: "07/08–09/08", zarpe: "09-ago", semana: 32, dow: 0, hora: "08:30", estado: "ok",           vista: "planMes" },
  { id: 12, embarque: "2026-4629", cliente: "Nutwork Handelsges.",   producto: "Inshell 30/32",   variedad: "Chandler", kgSol: 20500, kgDesp: null, pct: 100, stacking: "08/08–10/08", zarpe: null,     semana: 32, dow: 1, hora: "12:00", estado: "porConfirmar", vista: "planMes" },
  { id: 13, embarque: "2026-4851", cliente: "Bioalimentos Cía.",     producto: "Industrial",      variedad: "Chandler", kgSol: 14000, kgDesp: null, pct: 45,  stacking: "09/08–11/08", zarpe: null,     semana: 32, dow: 4, hora: "12:00", estado: "produccion",  vista: "planMes" },

  // En producción
  { id: 14, embarque: "2026-4860", cliente: "Bioalimentos Cía.",     producto: "Medium Pieces EL/L", variedad: "Chandler", kgSol: 22000, kgDesp: 9000, pct: 41, stacking: "08/08–10/08", zarpe: null, semana: 28, dow: 1, hora: "10:00", estado: "produccion",  vista: "produccion" },
  { id: 15, embarque: "2026-4862", cliente: "Madi Ventura SpA",      producto: "70% Halves EL/L",  variedad: "Serr",     kgSol: 19000, kgDesp: 7000, pct: 37, stacking: "08/08–10/08", zarpe: null, semana: 28, dow: 2, hora: "13:30", estado: "produccion",  vista: "produccion" },
  { id: 16, embarque: "2026-4864", cliente: "Nutwork Handelsges.",   producto: "Inshell 30/32",   variedad: "Chandler", kgSol: 21000, kgDesp: 5000, pct: 24, stacking: "09/08–11/08", zarpe: null, semana: 28, dow: 4, hora: "09:00", estado: "porConfirmar", vista: "produccion" },
  { id: 17, embarque: "2026-4866", cliente: "Rich Valley Dryfruit",  producto: "Inshell 34/36",   variedad: "Chandler", kgSol: 23000, kgDesp: 6000, pct: 26, stacking: "10/08–12/08", zarpe: "12-ago", semana: 29, dow: 0, hora: "15:00", estado: "produccion", vista: "produccion" },

  // Producido sin planificación
  { id: 18, embarque: "2026-4870", cliente: "Bella Frutta",         producto: "20% Halves EL/L",    variedad: "Chandler", kgSol: 0, kgDesp: 12000, pct: 100, stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: null, vista: "sinPlan" },
  { id: 19, embarque: "2026-4871", cliente: "AgroExport GmbH",      producto: "Medium Pieces EL/L", variedad: "Serr",     kgSol: 0, kgDesp: 9000,  pct: 100, stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: null, vista: "sinPlan" },
  { id: 20, embarque: "2026-4872", cliente: "Distribuidora Sur",    producto: "Industrial",         variedad: "Serr",     kgSol: 0, kgDesp: 7000,  pct: 100, stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: null, vista: "sinPlan" },

  // Despachados (tal como en "Últimos embarques despachados")
  { id: 21, embarque: "2026-4836", cliente: "Rich Valley Dryfruit",      producto: "Inshell 34/36", variedad: "Chandler", kgSol: 18000, kgDesp: 18000, pct: 100, stacking: "28/07–30/07", zarpe: "28-jul", semana: 30, dow: 0, hora: "09:00", estado: "despachado", vista: "despachados" },
  { id: 22, embarque: "2026-4792", cliente: "Vitality Nuts and Spices",  producto: "Inshell 36+",   variedad: "Chandler", kgSol: 18000, kgDesp: 18000, pct: 100, stacking: "24/07–27/07", zarpe: "25-jul", semana: 30, dow: 3, hora: "11:00", estado: "despachado", vista: "despachados" },
  { id: 23, embarque: "2026-4791", cliente: "Vitality Nuts and Spices",  producto: "Inshell 30/34", variedad: "Chandler", kgSol: 18000, kgDesp: 18000, pct: 100, stacking: "22/07–25/07", zarpe: "24-jul", semana: 29, dow: 5, hora: "08:00", estado: "despachado", vista: "despachados" },
  { id: 24, embarque: "2026-4789", cliente: "Dipak Foods",              producto: "Inshell 30/34", variedad: "Chandler", kgSol: 18000, kgDesp: 18000, pct: 100, stacking: "22/07–25/07", zarpe: "24-jul", semana: 29, dow: 4, hora: "10:00", estado: "despachado", vista: "despachados" },
  { id: 25, embarque: "2026-4778", cliente: "Vitality Nuts and Spices",  producto: "Inshell 30/34", variedad: "Chandler", kgSol: 18000, kgDesp: 13275, pct: 74, stacking: "20/07–23/07", zarpe: "23-jul", semana: 29, dow: 2, hora: "15:00", estado: "despachado", vista: "despachados" },
  { id: 26, embarque: "2026-4785", cliente: "Mokias G. & Co.",           producto: "Inshell 32/34", variedad: "Chandler", kgSol: 21000, kgDesp: 20940, pct: 100, stacking: "20/07–22/07", zarpe: "22-jul", semana: 29, dow: 1, hora: "13:00", estado: "despachado", vista: "despachados" },
];

GRILLA_PLANIFICACION_COMEX.forEach(r => { r.diferencia = r.kgDesp == null ? null : r.kgDesp - r.kgSol; });

const CLIENTES_COMEX = [...new Set(GRILLA_PLANIFICACION_COMEX.map(r => r.cliente))].sort();

Object.assign(window, {
  weekStartComex, addDaysComex, isoComex, fmtDiaCorto, fmtFCarga, DIAS_SEMANA_COMEX, MESES_COMEX, fechaFila,
  SEMANA_ACTUAL_COMEX, HOY_COMEX, TEMPORADAS_COMEX, MESES_OPERATIVOS_COMEX, SEMANA_RANGOS_COMEX, PRODVAR_OPCIONES_COMEX,
  ESTADOS_COMEX, estadoInfo, VISTAS_GRILLA_COMEX,
  EMBARQUES_COMPROMETIDOS_COMEX, CAPACIDAD_PLANTA_COMEX, DOCUMENTOS_EMBARQUE_COMEX, NAVES_PROXIMAS_COMEX,
  DESPACHOS_SEMANA_COMEX, STACKING_DESTINOS_COMEX, GRILLA_PLANIFICACION_COMEX, CLIENTES_COMEX,
});
