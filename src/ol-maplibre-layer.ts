import Layer from 'ol/layer/Layer';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';

import maplibregl from 'maplibre-gl';
import type {FrameState} from 'ol/Map';
import type {Options as LayerOptions} from 'ol/layer/Layer';

export type MapLibreLayerOptions = LayerOptions & {
  maplibreOptions: maplibregl.MapOptions;
};

export default class MapLibreLayer extends Layer {
  maplibreMap: maplibregl.Map;

  constructor(options: MapLibreLayerOptions) {
    const {maplibreOptions, ...baseOptions} = options;

    super(baseOptions);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    this.maplibreMap = new maplibregl.Map(
      Object.assign({}, maplibreOptions, {
        container: container,
        attributionControl: false,
        interactive: false,
        trackResize: false,
      })
    );

    this.applyOpacity_();
  }

  override setOpacity(opacity: number) {
    super.setOpacity(opacity);
    this.applyOpacity_();
  }

  private applyOpacity_() {
    const canvas = this.maplibreMap.getCanvas();
    const opacity = this.getOpacity().toString();
    if (opacity !== canvas.style.opacity) {
      canvas.style.opacity = opacity;
    }
  }

  override render(frameState: FrameState): HTMLElement {
    const viewState = frameState.viewState;

    // adjust view parameters in maplibre
    this.maplibreMap.jumpTo({
      center: toLonLat(viewState.center) as [number, number],
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-viewState.rotation),
    });

    const maplibreCanvas = this.maplibreMap.getCanvas();
    if (!maplibreCanvas.isConnected) {
      // The canvas is not connected to the DOM, request a map rendering at the next animation frame
      // to set the canvas size.
      this.getMapInternal()!.render();
    } else if (!sameSize(maplibreCanvas, frameState)) {
      this.maplibreMap.resize();
    }

    this.maplibreMap.redraw();

    return this.maplibreMap.getContainer();
  }
}

function sameSize(canvas: HTMLCanvasElement, frameState: FrameState): boolean {
  return (
    canvas.width === Math.floor(frameState.size[0] * frameState.pixelRatio) &&
    canvas.height === Math.floor(frameState.size[1] * frameState.pixelRatio)
  );
}
