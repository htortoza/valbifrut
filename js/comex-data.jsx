/* ============ COMEX DATA & HELPERS ============ */

const SEASON_START_COMEX = new Date(2025, 0, 6); // Monday, week 1

function weekStartComex(n) {
  const d = new Date(SEASON_START_COMEX);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}
function addDaysComex(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function isoComex(d) { return d.toISOString().slice(0, 10); }
function fmtDiaCorto(d) { return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }); }
const DIAS_SEMANA_COMEX = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function semanaLabelComex(n) {
  const start = weekStartComex(n);
  const end = addDaysComex(start, 6);
  return "S." + n + " · " + fmtDiaCorto(start) + "–" + fmtDiaCorto(end);
}
// fecha de una fila de grilla (o null si aún no tiene carga planificada)
function fechaFila(row) {
  if (row.semana == null || row.dow == null) return null;
  return addDaysComex(weekStartComex(row.semana), row.dow);
}

const SEMANA_ACTUAL_COMEX = 28;
const SEMANAS_COMEX = [24, 25, 26, 27, 28, 29, 30, 31].map(n => ({ n, label: semanaLabelComex(n) }));
const TEMPORADAS_COMEX = ["2025/26", "2024/25"];
const TIPOS_PRODUCTO_COMEX = ["NCC", "NSC"];
const PRODVAR_OPCIONES_COMEX = TIPOS_PRODUCTO_COMEX.concat(VARIEDADES.map(v => v.name));

const ESTADOS_COMEX = [
  { key: "ok",           label: "Reserva OK",         cls: "tag-done" },
  { key: "porConfirmar", label: "Por confirmar",      cls: "tag-rest" },
  { key: "produccion",   label: "En producción",      cls: "tag-comp" },
  { key: "sinNave",      label: "Sin nave asignada",  cls: "tag-plan" },
];
function estadoInfo(key) { return ESTADOS_COMEX.find(e => e.key === key) || ESTADOS_COMEX[3]; }

const VISTAS_GRILLA_COMEX = [
  { key: "planMes",      label: "Planificado mes" },
  { key: "produccion",   label: "En producción" },
  { key: "sinPlan",      label: "Producido sin planificación" },
  { key: "despachados",  label: "Despachados" },
];

/* ---- 3. Despachos por semana (histórico S.1 .. semana actual) ---- */
const DESPACHOS_SEMANA_COMEX = Array.from({ length: SEMANA_ACTUAL_COMEX }, (_, i) => {
  const n = i + 1;
  const cantidad = Math.max(1, 4 + Math.round(4 * Math.sin(i / 3.2)) + Math.round(i * 0.12));
  const kg = cantidad * 14200 + i * 850;
  return { semana: n, label: "S." + n, cantidad, kg, actual: n === SEMANA_ACTUAL_COMEX };
});

/* ---- 4. Stacking por destino (ventanas próximas) ---- */
const STACKING_DESTINOS_COMEX = [
  { destino: "Alemania", semana: 28, dow: 1, dias: 6, embarques: 6 },
  { destino: "Brasil",   semana: 28, dow: 3, dias: 7, embarques: 4 },
  { destino: "Corea",    semana: 29, dow: 0, dias: 7, embarques: 3 },
  { destino: "Italia",   semana: 29, dow: 5, dias: 8, embarques: 2 },
  { destino: "España",   semana: 31, dow: 2, dias: 7, embarques: 5 },
].sort((a, b) => (a.semana - b.semana) || (a.dow - b.dow));

/* ---- 5/6. Grilla de planificación (fuente única: grilla + calendario) ---- */
const GRILLA_PLANIFICACION_COMEX = [
  // Despachados
  { id: 1,  embarque: "EMB-2891", cliente: "AgroExport GmbH",  producto: "NCC", variedad: "Chandler", kgSol: 24000, kgDesp: 24000, stacking: "Alemania", zarpe: "MSC Alegria",  semana: 26, dow: 1, hora: "14:00", estado: "ok", vista: "despachados" },
  { id: 2,  embarque: "EMB-2894", cliente: "Nordic Fruit Co.", producto: "NSC", variedad: "Chandler", kgSol: 18000, kgDesp: 18200, stacking: "España",   zarpe: "Cap San Nicolas", semana: 26, dow: 3, hora: "09:30", estado: "ok", vista: "despachados" },
  { id: 3,  embarque: "EMB-2899", cliente: "Kim Trading",      producto: "NCC", variedad: "Serr",     kgSol: 20000, kgDesp: 19800, stacking: "Corea",    zarpe: "Hyundai Faith",   semana: 27, dow: 0, hora: "11:00", estado: "ok", vista: "despachados" },
  { id: 4,  embarque: "EMB-2903", cliente: "Distribuidora Sur",producto: "NSC", variedad: "Serr",     kgSol: 15000, kgDesp: 15000, stacking: "Brasil",   zarpe: "Log-In Jatoba",   semana: 27, dow: 4, hora: "16:00", estado: "ok", vista: "despachados" },
  { id: 5,  embarque: "EMB-2905", cliente: "Bella Frutta",     producto: "NCC", variedad: "Chandler", kgSol: 22000, kgDesp: 22300, stacking: "Italia",   zarpe: "Grande Angola",   semana: 27, dow: 6, hora: "08:00", estado: "ok", vista: "despachados" },

  // En producción
  { id: 6,  embarque: "EMB-2910", cliente: "AgroExport GmbH",   producto: "NCC", variedad: "Chandler", kgSol: 26000, kgDesp: 14000, stacking: "Alemania", zarpe: "MSC Alegria",     semana: 28, dow: 1, hora: "10:00", estado: "produccion", vista: "produccion" },
  { id: 7,  embarque: "EMB-2911", cliente: "Andes Import S.A.", producto: "NSC", variedad: "Serr",     kgSol: 19000, kgDesp: 9000,  stacking: "Corea",    zarpe: "Hyundai Faith",   semana: 28, dow: 2, hora: "13:30", estado: "produccion", vista: "produccion" },
  { id: 8,  embarque: "EMB-2913", cliente: "Nordic Fruit Co.",  producto: "NCC", variedad: "Serr",     kgSol: 21000, kgDesp: 8000,  stacking: "España",   zarpe: "Cap San Nicolas", semana: 28, dow: 4, hora: "09:00", estado: "produccion", vista: "produccion" },
  { id: 9,  embarque: "EMB-2916", cliente: "Kim Trading",       producto: "NSC", variedad: "Chandler", kgSol: 17000, kgDesp: 5000,  stacking: "Corea",    zarpe: null,              semana: 29, dow: 0, hora: "—",     estado: "porConfirmar", vista: "produccion" },
  { id: 10, embarque: "EMB-2918", cliente: "Distribuidora Sur", producto: "NCC", variedad: "Chandler", kgSol: 23000, kgDesp: 6000,  stacking: "Brasil",   zarpe: "Log-In Jatoba",   semana: 29, dow: 3, hora: "15:00", estado: "produccion", vista: "produccion" },

  // Planificado mes
  { id: 11, embarque: "EMB-2921", cliente: "Bella Frutta",      producto: "NSC", variedad: "Serr",     kgSol: 20000, kgDesp: 0, stacking: "Italia",   zarpe: null, semana: 29, dow: 5, hora: "—", estado: "porConfirmar", vista: "planMes" },
  { id: 12, embarque: "EMB-2924", cliente: "AgroExport GmbH",   producto: "NCC", variedad: "Chandler", kgSol: 24000, kgDesp: 0, stacking: "Alemania", zarpe: "MSC Alegria", semana: 30, dow: 1, hora: "10:00", estado: "ok", vista: "planMes" },
  { id: 13, embarque: "EMB-2927", cliente: "Andes Import S.A.", producto: "NSC", variedad: "Chandler", kgSol: 16000, kgDesp: 0, stacking: "Corea",    zarpe: null, semana: 30, dow: 2, hora: "—", estado: "sinNave", vista: "planMes" },
  { id: 14, embarque: "EMB-2930", cliente: "Nordic Fruit Co.",  producto: "NCC", variedad: "Serr",     kgSol: 18000, kgDesp: 0, stacking: "España",   zarpe: "Cap San Nicolas", semana: 30, dow: 4, hora: "14:00", estado: "ok", vista: "planMes" },
  { id: 15, embarque: "EMB-2933", cliente: "Kim Trading",       producto: "NSC", variedad: "Serr",     kgSol: 21000, kgDesp: 0, stacking: "Corea",    zarpe: null, semana: 31, dow: 0, hora: "—", estado: "sinNave", vista: "planMes" },

  // Producido sin planificación
  { id: 16, embarque: "EMB-2936", cliente: "Distribuidora Sur", producto: "NCC", variedad: "Chandler", kgSol: 0, kgDesp: 12000, stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: "sinNave", vista: "sinPlan" },
  { id: 17, embarque: "EMB-2938", cliente: "Bella Frutta",      producto: "NSC", variedad: "Chandler", kgSol: 0, kgDesp: 9000,  stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: "sinNave", vista: "sinPlan" },
  { id: 18, embarque: "EMB-2941", cliente: "AgroExport GmbH",   producto: "NCC", variedad: "Serr",     kgSol: 0, kgDesp: 7000,  stacking: "—", zarpe: null, semana: null, dow: null, hora: "—", estado: "sinNave", vista: "sinPlan" },
];

GRILLA_PLANIFICACION_COMEX.forEach(r => {
  r.diferencia = r.kgDesp - r.kgSol;
  r.pct = r.kgSol ? Math.min(100, Math.round((r.kgDesp / r.kgSol) * 100)) : (r.kgDesp ? 100 : 0);
});

const CLIENTES_COMEX = [...new Set(GRILLA_PLANIFICACION_COMEX.map(r => r.cliente))].sort();

/* ---- 1. Embarques comprometidos (recalculado según filas visibles) ---- */
function embarquesComprometidos(rows) {
  const total = rows.length;
  const despachados = rows.filter(r => r.vista === "despachados").length;
  const transito = rows.filter(r => r.vista === "produccion" && r.zarpe).length;
  const porDespachar = total - despachados - transito;
  return { total, despachados, porDespachar, transito };
}

/* ---- 2. Capacidad planta / stock (fijo, nivel planta) ---- */
const CAPACIDAD_PLANTA_COMEX = { pctOcupacion: 74, stockDisponible: 186000, capacidadUtilizada: 520000, capacidadDisponible: 180000 };

Object.assign(window, {
  weekStartComex, addDaysComex, isoComex, fmtDiaCorto, DIAS_SEMANA_COMEX, fechaFila,
  SEMANA_ACTUAL_COMEX, SEMANAS_COMEX, TEMPORADAS_COMEX, PRODVAR_OPCIONES_COMEX,
  ESTADOS_COMEX, estadoInfo, VISTAS_GRILLA_COMEX,
  DESPACHOS_SEMANA_COMEX, STACKING_DESTINOS_COMEX, GRILLA_PLANIFICACION_COMEX,
  CLIENTES_COMEX, embarquesComprometidos, CAPACIDAD_PLANTA_COMEX,
});
