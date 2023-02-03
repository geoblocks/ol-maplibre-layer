import Source from 'ol/source/Source';

export default class MapLibreSource extends Source {
  constructor(options) {
    super(options);
  }

  /**
   * Set the reference to MapLibre Map instance.
   */
  setMapLibreMap(mapLibreMap) {
    this.mapLibreMap = mapLibreMap;
  }

  /**
   * Refresh the Ol Source, but also EVERY MapLibre source.
   */
  refresh() {
    if (!this.mapLibreMap) {
      return;
    }
    const sourcesObjects = this.mapLibreMap.style.sourceCaches;
    if (!sourcesObjects) {
      return;
    }
    Object.values(sourcesObjects).forEach((source) => source.clearTiles());
    super.refresh();
  }
}
