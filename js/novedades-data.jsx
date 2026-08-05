/* ============ NOVEDADES COMERCIALES · DATA & HELPERS ============ */

const TEMPORADAS_NOV = ["2026", "2025"];
const RANGOS_NOV = ["Últimos 7 días", "Últimos 14 días", "Este mes"];
const MERCADOS_NOV = ["India", "Italia", "Alemania", "Marruecos", "España"];
const PRODVAR_OPCIONES_NOV = VARIEDADES.map(v => v.name).concat(["Inshell", "Shelled", "EQQCC"]);

/* ---- 1. Nuevos contratos ---- */
const NUEVOS_CONTRATOS_NOV = [
  { contrato: "2026-2096", cliente: "Nötkompaniet AB",         kg: 24794, mercado: "Alemania" },
  { contrato: "2026-2095", cliente: "Bioalimentos Cía. Ltda.", kg: 22540, mercado: "España" },
  { contrato: "2026-2094", cliente: "Maximiliano Grohnert",    kg: 20160, mercado: "Alemania" },
  { contrato: "2026-2093", cliente: "Gerardo Bustos",           kg: 18900, mercado: "España" },
  { contrato: "2026-2092", cliente: "Murano S.p.A.",           kg: 70560, mercado: "Italia" },
];

/* ---- 2. Estadísticas de kilos · temporada ---- */
const KILOS_TEMPORADA_NOV = [
  { tipo: "Inshell", comprometidos: 2496260, despachados: 1519325, porDespachar: 976935 },
  { tipo: "Shelled",  comprometidos: 1609557, despachados: 774807,  porDespachar: 834750 },
  { tipo: "EQQCC",    comprometidos: 5965881, despachados: 3189528, porDespachar: 2776353 },
];
const AVANCE_EQQCC_NOV = 53.5;

/* ---- 3. % de venta ---- */
const VENTA_NOV = {
  pctVenta: 72.4, kgVendidos: 5965881, objetivoKg: 8240000,
  pctDespachadoDeVendido: 53.5, kgDespachados: 3189528, kgPorDespachar: 2776353,
  pctEmbarquesDespachados: 58,
};

/* ---- 4. Embarques (temporada) ---- */
const EMBARQUES_NOV = { total: 272, despachados: 158, porDespachar: 114 };

/* ---- Top 5 mercados ---- */
const TOP_MERCADOS_NOV = [
  { pais: "India",      kg: 931925, usd: 1.66 },
  { pais: "Italia",     kg: 784156, usd: 2.26 },
  { pais: "Alemania",   kg: 651163, usd: 0.85 },
  { pais: "Marruecos",  kg: 342900, usd: 0.68 },
  { pais: "España",     kg: 263087, usd: 1.03 },
];
const TOP_MERCADOS_KG_NOV = TOP_MERCADOS_NOV.reduce((s, m) => s + m.kg, 0);
const TOP_MERCADOS_USD_NOV = TOP_MERCADOS_NOV.reduce((s, m) => s + m.usd, 0);

/* ---- Últimos embarques despachados ---- */
const EMBARQUES_DESPACHADOS_NOV = [
  { emb: "2026-4836", cliente: "Rich Valley Dryfruit",     producto: "Inshell 34/36 · Chandler", semDesp: "S31 (28-07-26)", semComp: "S31 (27-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 1 },
  { emb: "2026-4792", cliente: "Vitality Nuts and Spices", producto: "Inshell 36+ · Chandler",   semDesp: "S30 (25-07-26)", semComp: "S30 (24-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 4 },
  { emb: "2026-4791", cliente: "Vitality Nuts and Spices", producto: "Inshell 30/34 · Chandler", semDesp: "S30 (24-07-26)", semComp: "S30 (24-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 5 },
  { emb: "2026-4789", cliente: "Dipak Foods",              producto: "Inshell 30/34 · Chandler", semDesp: "S30 (24-07-26)", semComp: "S30 (23-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 5 },
  { emb: "2026-4830", cliente: "Rich Valley Dryfruit",     producto: "Inshell 30/34 · Chandler", semDesp: "S30 (24-07-26)", semComp: "S30 (22-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 5 },
  { emb: "2026-4778", cliente: "Vitality Nuts and Spices", producto: "Inshell 30/34 · Chandler", semDesp: "S30 (23-07-26)", semComp: "S30 (22-07-26)", kgSol: 18000, kgDesp: 13275, diasAtras: 6 },
  { emb: "2026-4788", cliente: "Dipak Foods",              producto: "Inshell 30/34 · Chandler", semDesp: "S30 (23-07-26)", semComp: "S30 (22-07-26)", kgSol: 18000, kgDesp: 18000, diasAtras: 6 },
  { emb: "2026-4785", cliente: "Mokias G. & Co.",          producto: "Inshell 32/34 · Chandler", semDesp: "S30 (22-07-26)", semComp: "S30 (22-07-26)", kgSol: 21000, kgDesp: 20940, diasAtras: 7 },
];
EMBARQUES_DESPACHADOS_NOV.forEach(r => {
  r.dif = r.kgDesp - r.kgSol;
  r.estado = Math.abs(r.dif) <= 100 ? "Despachado" : "Revisar";
});

const CLIENTES_NOV = [...new Set(NUEVOS_CONTRATOS_NOV.map(r => r.cliente).concat(EMBARQUES_DESPACHADOS_NOV.map(r => r.cliente)))].sort();

Object.assign(window, {
  TEMPORADAS_NOV, RANGOS_NOV, MERCADOS_NOV, PRODVAR_OPCIONES_NOV, CLIENTES_NOV,
  NUEVOS_CONTRATOS_NOV, KILOS_TEMPORADA_NOV, AVANCE_EQQCC_NOV, VENTA_NOV, EMBARQUES_NOV,
  TOP_MERCADOS_NOV, TOP_MERCADOS_KG_NOV, TOP_MERCADOS_USD_NOV, EMBARQUES_DESPACHADOS_NOV,
});
