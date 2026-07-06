/* ============ DATA & HELPERS (Valbifrut) ============ */

// Walnut varieties — NCC (Nuez Con Cáscara) / NSC (Nuez Sin Cáscara)
const VARIEDADES = [
  { key: "chandler", name: "Chandler", precio: 2.40 },
  { key: "serr",     name: "Serr",     precio: 2.10 },
];

// Default budget (kg) per variety — overridable by user, persisted to localStorage
const PRESUPUESTO_DEFAULT = {
  chandler: 380000,
  serr:     150000,
};

// Processed so far (kg)
const PROCESADO = {
  chandler: 320000,
  serr:     120000,
};

const DESTINOS = ["Todos", "Alemania", "Brasil", "Corea", "Italia", "España"];
const CALIDADES = ["Todas", "Extra Light", "Light", "Light Amber", "Amber", "Industrial"];
const VARIEDADES_FILTRO = ["Todas", "Chandler", "Serr"];

// Annual sales (TN) — projection 2026 vs prior years for the historical comparison
const VENTAS_ANUALES = [
  { year: "2021", val: 1180, hist: true },
  { year: "2022", val: 1340, hist: true },
  { year: "2023", val: 1520, hist: true },
  { year: "2024", val: 1610, hist: true },
  { year: "2025", val: 1740, hist: true },
  { year: "2026", val: 1980, hist: false }, // proyección
];

// Volume by country (line chart) — 12 monthly points, 3 series
const VOL_PAISES = {
  meses: ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SET","OCT","NOV","DIC"],
  ale: [22,26,31,38,46,55,63,72,80,86,92,97],
  bra: [18,20,24,30,33,30,40,52,58,52,46,50],
  kor: [28,30,34,36,33,29,30,32,33,33,32,34],
};

const MERCADOS = [
  { pais: "Alemania", vol: 850.5, fact: 1938000, pedidos: 18, delta: "+15.2%", part: 20, precio: 12.03 },
  { pais: "Brasil",   vol: 420.2, fact: 958000,  pedidos: 12, delta: "+4.8%",  part: 40, precio: 4.37 },
  { pais: "Corea",    vol: 312.0, fact: 742000,  pedidos: 9,  delta: "+9.1%",  part: 22, precio: 2.38 },
];

const COMPETIDORES = [
  { pos: 1, exp: "Nuestra Empresa", part: 12.5, precio: 2.28, propio: true },
  { pos: 2, exp: "Global Nuts Ltd.", part: 10.2, precio: 2.15 },
  { pos: 3, exp: "Pacific Agro",     part: 8.7,  precio: 2.32 },
  { pos: 4, exp: "Valle Central",    part: 7.1,  precio: 2.10 },
];

// Quality parameters (default — manual or from DB)
const CALIDAD_PARAMS_DEFAULT = [
  { key: "humedad",   label: "Humedad",            unidad: "%",  min: 6.0,  max: 8.0,  obj: 7.0 },
  { key: "calibre",   label: "Calibre promedio",   unidad: "mm", min: 30,   max: 34,   obj: 32 },
  { key: "rendim",    label: "Rendimiento pulpa",  unidad: "%",  min: 48,   max: 54,   obj: 50 },
  { key: "color",     label: "Color (Extra Light)",unidad: "%",  min: 70,   max: 100,  obj: 85 },
  { key: "defectos",  label: "Defectos",           unidad: "%",  min: 0,    max: 5,    obj: 2 },
];

// Mechanical cracking cuts (Cortes del Partido Mecánico) — default
const CORTES_DEFAULT = [
  { key: "mitades",   label: "Mitades",        pct: 42, kg: 0 },
  { key: "cuartos",   label: "Cuartos",        pct: 28, kg: 0 },
  { key: "octavos",   label: "Octavos",        pct: 16, kg: 0 },
  { key: "trozos",    label: "Trozos / granel",pct: 10, kg: 0 },
  { key: "merma",     label: "Merma",          pct: 4,  kg: 0 },
];

/* ---------- formatting ---------- */
function fmtKg(n) {
  return Math.round(n).toLocaleString("en-US") + " KG";
}
function fmtUsd(n) {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(2) + "M USD";
  return "$" + Math.round(n).toLocaleString("en-US") + " USD";
}
function fmtUsdFull(n) {
  return "$" + Math.round(n).toLocaleString("en-US") + " USD";
}
function fmtPct(n) {
  return (Math.round(n * 10) / 10).toFixed(1) + "%";
}

// Format a value for a variety according to unit (kg / usd / pct)
// total used for percentage base
function fmtUnit(kg, precio, unit, total) {
  if (unit === "kg")  return Math.round(kg).toLocaleString("en-US");
  if (unit === "usd") return "$" + Math.round(kg * precio).toLocaleString("en-US");
  if (unit === "pct") return total ? fmtPct((kg / total) * 100) : "0%";
  return kg;
}

const UNIT_SUFFIX = { kg: "KG", usd: "USD", pct: "" };

// Projected prices per product
const PRECIOS_DEFAULT = [
  { key: "ncc_36p",  label: "NCC +36mm",               unidad: "USD/kg", min: 2.80, max: 3.40, obj: 3.10 },
  { key: "ncc_3436", label: "NCC 34-36mm",              unidad: "USD/kg", min: 2.65, max: 3.25, obj: 2.95 },
  { key: "ncc_3234", label: "NCC 32-34mm",              unidad: "USD/kg", min: 2.40, max: 3.00, obj: 2.70 },
  { key: "ncc_3032", label: "NCC 30-32mm",              unidad: "USD/kg", min: 2.15, max: 2.75, obj: 2.45 },
  { key: "ncc_2830", label: "NCC 28-30mm",              unidad: "USD/kg", min: 1.90, max: 2.50, obj: 2.20 },
  { key: "nsc_mar",  label: "NSC Mariposas EL/L",       unidad: "USD/kg", min: 7.80, max: 9.00, obj: 8.40 },
  { key: "nsc_cua",  label: "NSC Cuartos EL/L",         unidad: "USD/kg", min: 6.60, max: 7.80, obj: 7.20 },
  { key: "nsc_c69",  label: "NSC Cuartillos 6-9/9-13mm",unidad: "USD/kg", min: 5.60, max: 6.60, obj: 6.10 },
  { key: "nsc_ind",  label: "NSC Industrial A y B",     unidad: "USD/kg", min: 2.80, max: 3.60, obj: 3.20 },
];

// Cross-tab: variety × type for each metric (chandlerNcc, chandlerNsc, serrNcc, serrNsc)
const METRICAS = {
  presupuesto:  { chandlerNcc: 686000, chandlerNsc: 384000, serrNcc: 294000, serrNsc: 164000 },
  despachado:   { chandlerNcc: 381000, chandlerNsc: 211000, serrNcc: 163000, serrNsc:  91000 },
  comprometido: { chandlerNcc: 108000, chandlerNsc:  60000, serrNcc:  46000, serrNsc:  25000 },
  porVender:    { chandlerNcc: 155000, chandlerNsc:  89000, serrNcc:  66000, serrNsc:  38000 },
};

Object.assign(window, {
  VARIEDADES, PRESUPUESTO_DEFAULT, PROCESADO,
  DESTINOS, CALIDADES, VARIEDADES_FILTRO,
  VENTAS_ANUALES, VOL_PAISES, MERCADOS, COMPETIDORES,
  CALIDAD_PARAMS_DEFAULT, CORTES_DEFAULT, PRECIOS_DEFAULT,
  METRICAS,
  fmtKg, fmtUsd, fmtUsdFull, fmtPct, fmtUnit, UNIT_SUFFIX,
});
