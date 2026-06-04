/* ============ PRODUCTION DATA (Valbifrut) ============ */

const CALIBRADO_DATA = {
  volumenTotal:  45280,
  kgHora:        827,
  descarte:      1420,
  descarteHora:  83,
  prodMaquina:   6299,
  prodMaquinaSub:"kg / hora",
  prodHombre:    83,
  prodHombreSub: "kg / hora",
  pctRend:       83,
  calibres: [
    { label: "<26",   pct: 0.43,  pct2: 0.43  },
    { label: "26-28", pct: 2.35,  pct2: 2.35  },
    { label: "28-30", pct: 8.26,  pct2: 8.26  },
    { label: "30-32", pct: 20.98, pct2: 20.98 },
    { label: "32-34", pct: 33.95, pct2: 33.95 },
    { label: "34-36", pct: 24.85, pct2: 24.85 },
    { label: "36+",   pct: 9.18,  pct2: 9.18  },
  ],
  productores: [
    { nombre: "Funda Los Nogales",  lote: "527",   kg: "1,402 kg" },
    { nombre: "Serrantur S.A.",     lote: "10/20", kg: "1,402 kg" },
    { nombre: "Agricola El Olivar", lote: "400",   kg: "1,402 kg" },
    { nombre: "Fundo Santa Ana",    lote: "312",   kg: "1,402 kg" },
    { nombre: "Huertos del Sur",    lote: "618",   kg: "1,402 kg" },
  ],
};

const ENSACADO_DATA = {
  volumenTotal:  42860,
  volumenPct:    "83%",
  descarte:      1420,
  descartePct:   "3.3%",
  vanas:         860,
  vanasPct:      "2.0%",
  prodMaquina:   95,
  prodHombre:    20,
  lotes: [
    { producto: "Saco 25kg", num: "L-4062-A", cliente: "Funda Los Nogales",  kilos: "1,402 kg", envase: "Saco",  variedad: "Chandler", envasado: "Europa", ensacado: "Europa" },
    { producto: "Saco 25kg", num: "L-4062-B", cliente: "Agricola El Olivar", kilos: "1,402 kg", envase: "Saco",  variedad: "Chandler", envasado: "Europa", ensacado: "Europa" },
    { producto: "Saco 25kg", num: "L-4062-C", cliente: "Funda Los Nogales",  kilos: "1,402 kg", envase: "Saco",  variedad: "Serr",     envasado: "Europa", ensacado: "Europa" },
    { producto: "Saco 25kg", num: "L-4062-D", cliente: "Agricola El Olivar", kilos: "1,402 kg", envase: "Saco",  variedad: "Serr",     envasado: "Europa", ensacado: "Europa" },
  ],
  calibres: [
    { label: "28/30", pct: 35, pct2: 28 },
    { label: "30/32", pct: 30, pct2: 24 },
    { label: "32/34", pct: 20, pct2: 16 },
    { label: "34/36", pct: 10, pct2: 8  },
    { label: "36+",   pct: 5,  pct2: 4  },
  ],
  defectosExt: [
    { label: "Manchas",    pct: 22, pct2: 18 },
    { label: "Deformidad", pct: 15, pct2: 12 },
    { label: "Rotura",     pct: 10, pct2: 8  },
    { label: "Suciedad",   pct: 8,  pct2: 6  },
    { label: "Picadura",   pct: 5,  pct2: 4  },
  ],
  defectosInt: [
    { label: "Marrón",  pct: 18, pct2: 14 },
    { label: "Seco",    pct: 12, pct2: 9  },
    { label: "Mohoso",  pct: 6,  pct2: 5  },
    { label: "Rancio",  pct: 4,  pct2: 3  },
  ],
  colores: [
    { label: "Extra Light", pct: 48, pct2: 42 },
    { label: "Light",       pct: 30, pct2: 26 },
    { label: "Light Amber", pct: 14, pct2: 12 },
    { label: "Amber",       pct: 8,  pct2: 6  },
  ],
};

const PARTIDO_DATA = {
  rendPepa:          44.83,
  rendPepaKg:         5299,
  mitades:           44.83,
  mitadesKg:          5299,
  totalVaciado:      18500,
  totalVaciadoPct:      83,
  mpSeca:            15000,
  entradaPrecalibre:  2000,
  productividad:     18500,
  horasHombres:        2.5,
  descarte:           1500,
  cuadrillas: [
    { nombre: "Cuadrilla 1", lhp: "1.4H", destino: "Europa" },
    { nombre: "Cuadrilla 2", lhp: "2.6H", destino: "Europa" },
    { nombre: "Cuadrilla 3", lhp: "3.5H", destino: "Europa" },
    { nombre: "Cuadrilla 4", lhp: "1.8H", destino: "Europa" },
    { nombre: "Cuadrilla 5", lhp: "2.3H", destino: "Europa" },
    { nombre: "Cuadrilla 6", lhp: "4.5H", destino: "Europa" },
  ],
  barras: [
    { label: "11 jan", mitades: 8200,  vaciado: 4200, pepa: 1800 },
    { label: "13 jan", mitades: 9000,  vaciado: 4500, pepa: 2000 },
    { label: "15 jan", mitades: 7500,  vaciado: 3800, pepa: 1700 },
    { label: "17 jan", mitades: 9200,  vaciado: 5000, pepa: 1800 },
    { label: "19 jan", mitades: 8700,  vaciado: 4800, pepa: 1500 },
    { label: "21 jan", mitades: 8400,  vaciado: 4200, pepa: 1900 },
  ],
};

const SELECCION_DATA = {
  stockSel:      8288,
  kgEntrada:     8288,
  eficiencia:    94.7,
  productividad: 14020,
  unidades:      14020,
  fuentes: [
    { fundo: "Funda Los Nogales",  embargado: "1,840 kg", productor: "Funda Los Nogales", destino: "India", clienteFinal: "Global Foods Turkey", producto: "Europe", variedad: "Europe" },
    { fundo: "Agricola El Olivar", embargado: "1,840 kg", productor: "Funda Los Nogales", destino: "India", clienteFinal: "Global Foods Turkey", producto: "Europe", variedad: "Europe" },
    { fundo: "Agricola El Olivar", embargado: "1,840 kg", productor: "Funda Los Nogales", destino: "India", clienteFinal: "Global Foods Turkey", producto: "Europe", variedad: "Europe" },
    { fundo: "Agricola El Olivar", embargado: "1,840 kg", productor: "Funda Los Nogales", destino: "India", clienteFinal: "Global Foods Turkey", producto: "Europe", variedad: "Europe" },
  ],
  defectosInt: [
    { label: "Marrón",  pct: 20, pct2: 15 },
    { label: "Seco",    pct: 14, pct2: 10 },
    { label: "Mohoso",  pct: 7,  pct2: 5  },
    { label: "Rancio",  pct: 5,  pct2: 4  },
  ],
  colores: [
    { label: "Extra Light", pct: 50, pct2: 44 },
    { label: "Light",       pct: 28, pct2: 24 },
    { label: "Light Amber", pct: 14, pct2: 11 },
    { label: "Amber",       pct: 8,  pct2: 6  },
  ],
  tolerancia: [
    { label: "Daño físico",   pct: 12, pct2: 10 },
    { label: "Insectos",      pct: 6,  pct2: 5  },
    { label: "Contaminación", pct: 4,  pct2: 3  },
    { label: "Humedad",       pct: 9,  pct2: 7  },
  ],
  calibres: [
    { label: "4ème",  pct: 38, pct2: 32 },
    { label: "6ème",  pct: 32, pct2: 26 },
    { label: "8ème",  pct: 18, pct2: 15 },
    { label: "10ème", pct: 8,  pct2: 6  },
    { label: "12ème", pct: 4,  pct2: 3  },
  ],
};

const CONSOLIDADO_DATA = [
  { calibrado: "Miades",           presentacion: "4,100 kg", variedad: "-3%",  estado: "412 kg", cantKg: "+41%", monto: "+41%", negVar: true },
  { calibrado: "Cuartos",          presentacion: "800 kg",   variedad: "-61%", estado: "412 kg", cantKg: "+5%",  monto: "+5%",  negVar: true },
  { calibrado: "Trozos",           presentacion: "150 kg",   variedad: "+3%",  estado: "432 kg", cantKg: "+3%",  monto: "+3%"  },
  { calibrado: "X3 piezas",        presentacion: "800 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
  { calibrado: "1/2 Light",        presentacion: "800 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
  { calibrado: "1/2 Light Ámbar",  presentacion: "800 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
  { calibrado: "5/4 LA",           presentacion: "150 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
  { calibrado: "Ídeas",            presentacion: "800 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
  { calibrado: "Mc Amarillo",      presentacion: "150 kg",   variedad: "+5%",  estado: "432 kg", cantKg: "+5%",  monto: "+5%"  },
  { calibrado: "Otros",            presentacion: "800 kg",   variedad: "+4%",  estado: "432 kg", cantKg: "+4%",  monto: "+4%"  },
];

const RESUMEN_DATA = {
  calibradoNCC: {
    diario:    { producido: 30000,  meta: 40000  },
    temporada: { acumulado: 600000, meta: 550000 },
  },
  seleccionNSC: {
    diario:    { producido: null,   meta: 35000  },
    temporada: { acumulado: null,   meta: 500000 },
  },
  seleccionNCC: {
    diario:    { producido: 18000,  meta: 20000  },
    temporada: { acumulado: 320000, meta: 300000 },
  },
  envasadoNSC: {
    diario:    { producido: 25000,  meta: 25000  },
    temporada: { acumulado: 480000, meta: 500000 },
  },
  envasadoNCC: {
    diario:    { producido: null,   meta: 18000  },
    temporada: { acumulado: null,   meta: 350000 },
  },
  prodHH:            { valor: 1666, meta: 1500 },
  eficienciaMaquina: { valor: 85,   meta: 100  },
};

Object.assign(window, {
  CALIBRADO_DATA,
  ENSACADO_DATA,
  PARTIDO_DATA,
  SELECCION_DATA,
  CONSOLIDADO_DATA,
  RESUMEN_DATA,
});
