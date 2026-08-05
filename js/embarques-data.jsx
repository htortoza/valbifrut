/* ============ EMBARQUES · DATA & HELPERS ============ */

const TEMPORADAS_EMB = ["2026", "2025"];
const CONTRATOS_EMB = ["2026-2082", "2026-2025", "2026-2035", "2026-2040"];
const PRODVAR_OPCIONES_EMB = ["Chandler", "Serr", "Inshell 30/32", "Inshell 34/36", "80% Halves EL/L"];
const PAISES_PUERTO_EMB = ["India · Mundra", "Alemania · Hamburg", "Italia · Napoli", "España · Valencia"];
const ESTADOS_EMB = ["Despachado", "Zarpado", "En tránsito", "Arribado"];

const STEPS_LABELS_EMB = ["Despachado", "Zarpe", "Arribado", "Pagado", "Cont. devuelto"];

function stepsEmb({ despachado, zarpe, arribado, arriboActual, pagado, contDevuelto }) {
  const lastDoneIdx = [despachado, zarpe, arribado, pagado, contDevuelto].reduce((acc, v, i) => v ? i : acc, -1);
  return [
    { label: "Despachado",     date: despachado || null,  done: !!despachado },
    { label: "Zarpe",          date: zarpe || null,        done: !!zarpe },
    { label: "Arribado",       date: arribado || (arriboActual ? "ETA act. " + arriboActual : null), done: !!arribado, current: !arribado && !!arriboActual && lastDoneIdx === 1 },
    { label: "Pagado",         date: pagado || null,       done: !!pagado },
    { label: "Cont. devuelto", date: contDevuelto || null, done: !!contDevuelto },
  ];
}

const GRILLA_EMBARQUES_EMB = [
  {
    emb: "2026-4836", contrato: "2026-2082", cliente: "Rich Valley Dryfruit", incoterm: "CIF", mercado: "India",
    producto: "Inshell 34/36", variedad: "Chandler", kg: 18000, monto: null,
    destino: "Mundra", etd: "31/07", eta: "22/09",
    steps: stepsEmb({ despachado: "28/07" }),
  },
  {
    emb: "2026-4628", contrato: "2026-2025", cliente: "Nutwork Handelsges.", incoterm: "CFR", mercado: "Alemania",
    producto: "Inshell 30/32", variedad: "Chandler", kg: 21000, monto: 52500,
    destino: "Hamburg", etd: "26/06", eta: "26/07", etaActualizada: "28/07",
    steps: stepsEmb({ despachado: "26/06", zarpe: "26/06", arriboActual: "28/07" }),
    seleccionado: true,
  },
  {
    emb: "2026-4627", contrato: "2026-2025", cliente: "Nutwork Handelsges.", incoterm: "CFR", mercado: "Alemania",
    producto: "Inshell 30/32", variedad: "Chandler", kg: 20975, monto: 52438,
    destino: "Hamburg", etd: "05/06", eta: "05/07",
    steps: stepsEmb({ despachado: "05/06", zarpe: "05/06", arribado: "05/07" }),
  },
  {
    emb: "2026-4662", contrato: "2026-2035", cliente: "Murano S.p.A.", incoterm: "CIF", mercado: "Italia",
    producto: "80% Halves EL/L", variedad: "Chandler", kg: 17640, monto: 132300,
    destino: "Napoli", etd: "17/05", eta: "21/06",
    steps: stepsEmb({ despachado: "17/05", zarpe: "17/05", arribado: "21/06" }),
  },
  {
    emb: "2026-4705", contrato: "2026-2040", cliente: "Importaco Casa Pons", incoterm: "FOB", mercado: "España",
    producto: "80% Halves EL/L", variedad: "Chandler", kg: 18060, monto: null,
    destino: "Valencia", etd: "02/08", eta: "13/09", progSemana: "S.31",
    steps: stepsEmb({}),
  },
];

const CLIENTES_EMB = [...new Set(GRILLA_EMBARQUES_EMB.map(r => r.cliente))].sort();

const DETALLE_SELECCIONADO_EMB = (() => {
  const row = GRILLA_EMBARQUES_EMB.find(r => r.seleccionado);
  return {
    ...row,
    estadoBadge: "En tránsito",
    ultimaActualizacion: "28/07/2026 15:36",
    contenedor: "HAMU413131-7", booking: "34600392", tipoContenedor: "40' Dry HC",
    naviera: "Hapag Lloyd", nave: "CMA CGM Jacques Joseph", puertoSalida: "San Antonio",
    pagos: { total: row.monto, pagado: null, saldo: null },
    condicionPago: null, vencimientoPago: null,
    documentos: { factura: "FV 2860", bl: true, packingList: false, certOrigen: false },
    aviso: "ETA actualizada al 28/07 ya cumplida · confirmar arribo en Hamburg y registrar fecha efectiva.",
    gestion: { responsable: "Comex", proximaAccion: "Confirmar arribo / actualizar tracking", ultimaActualizacion: "28/07/2026 15:36" },
  };
})();

Object.assign(window, {
  TEMPORADAS_EMB, CONTRATOS_EMB, PRODVAR_OPCIONES_EMB, PAISES_PUERTO_EMB, ESTADOS_EMB, STEPS_LABELS_EMB,
  GRILLA_EMBARQUES_EMB, CLIENTES_EMB, DETALLE_SELECCIONADO_EMB,
});
