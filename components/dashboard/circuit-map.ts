const CIRCUIT_GEOJSON: Record<string, string> = {
  albert_park: "/circuits/australian.geojson",
  shanghai: "/circuits/chinese.geojson",
  suzuka: "/circuits/japanese.geojson",
  bahrain: "/circuits/bahrain.geojson",
  jeddah: "/circuits/saudi_arabian.geojson",
  miami: "/circuits/miami.geojson",
  imola: "/circuits/emilia_romagna.geojson",
  monaco: "/circuits/monaco.geojson",
  catalunya: "/circuits/spanish.geojson",
  villeneuve: "/circuits/canadian.geojson",
  red_bull_ring: "/circuits/austrian.geojson",
  silverstone: "/circuits/british.geojson",
  spa: "/circuits/belgian.geojson",
  hungaroring: "/circuits/hungarian.geojson",
  zandvoort: "/circuits/dutch.geojson",
  monza: "/circuits/italian.geojson",
  baku: "/circuits/azerbaijan.geojson",
  marina_bay: "/circuits/singapore.geojson",
  americas: "/circuits/usa.geojson",
  rodriguez: "/circuits/mexico_city.geojson",
  interlagos: "/circuits/brazilian.geojson",
  vegas: "/circuits/las_vegas.geojson",
  losail: "/circuits/qatar.geojson",
  yas_marina: "/circuits/abu_dhabi.geojson",
};

export function getCircuitGeojsonPath(circuitId?: string): string | null {
  if (!circuitId) return null;
  return CIRCUIT_GEOJSON[circuitId] ?? null;
}
