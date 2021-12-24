import Layer from 'ol/layer/Layer';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';

import maplibregl from 'maplibre-gl';

/**
 * @typedef {Object} Options
 * @property {Object<string, *>} maplibreOptions
 */


export default class MapLibreLayer extends Layer {

  /**
   * @param {Options} options
   */
  constructor(options) {

    const baseOptions = Object.assign({}, options);

    delete baseOptions.maplibreOptions;

    super(baseOptions);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    this.maplibreMap = new maplibregl.Map(Object.assign({}, options.maplibreOptions, {
      container: container,
      attributionControl: false,
      interactive: false
    }));
  }

  /**
   * @param {import('ol/PluggableMap').FrameState} frameState
   * @return {HTMLCanvasElement} canvas
   */
  render(frameState) {
    const canvas = this.maplibreMap.getCanvas();
    const viewState = frameState.viewState;

    const opacity = this.getOpacity().toString();
    if (opacity !== canvas.style.opacity) {
      canvas.style.opacity = opacity;
    }

    // adjust view parameters in maplibre
    this.maplibreMap.jumpTo({
      center: toLonLat(viewState.center),
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-viewState.rotation),
      animate: false
    });

    this.maplibreMap.resize();
    this.maplibreMap.redraw();

    return this.maplibreMap.getContainer();
  }
}
