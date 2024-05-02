import {FrameState} from 'ol/Map';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';
import LayerRenderer from 'ol/renderer/Layer';
import GeoJSON from 'ol/format/GeoJSON';
import {Coordinate} from 'ol/coordinate';
import {FeatureCallback} from 'ol/renderer/vector';
import {Feature} from 'ol';
import {Geometry, SimpleGeometry} from 'ol/geom';
import {Pixel} from 'ol/pixel';
import MapLibreLayer from './ol-maplibre-layer';
import {MapGeoJSONFeature} from 'maplibre-gl';

const VECTOR_TILE_FEATURE_PROPERTY = 'vectorTileFeature';

const formats: {
  [key: string]: GeoJSON;
} = {
  'EPSG:3857': new GeoJSON({
    featureProjection: 'EPSG:3857',
  }),
};

/**
 * This class is a renderer for Maplibre Layer to be able to use the native ol
 * functionnalities like map.getFeaturesAtPixel or map.hasFeatureAtPixel.
 */
export default class MaplibreLayerRenderer extends LayerRenderer<MapLibreLayer> {
  getFeaturesAtCoordinate(
    coordinate: Coordinate | undefined,
    hitTolerance: number = 5,
  ): Feature<Geometry>[] {
    const pixels = this.getMaplibrePixels(coordinate, hitTolerance);

    if (!pixels) {
      return [];
    }

    const queryRenderedFeaturesOptions =
      (this.getLayer().get(
        'queryRenderedFeaturesOptions',
      ) as maplibregl.QueryRenderedFeaturesOptions) || {};

    // At this point we get GeoJSON Maplibre feature, we transform it to an OpenLayers
    // feature to be consistent with other layers.
    const features = this.getLayer()
      .maplibreMap?.queryRenderedFeatures(pixels, queryRenderedFeaturesOptions)
      .map(this.toOlFeature.bind(this));

    return features || [];
  }

  override prepareFrame() {
    return true;
  }

  override renderFrame(frameState: FrameState) {
    const layer = this.getLayer();
    const {maplibreMap} = layer;
    const map = layer.getMapInternal();
    if (!layer || !map || !maplibreMap) {
      return null;
    }

    const maplibreCanvas = maplibreMap.getCanvas();
    const {viewState} = frameState;

    // adjust view parameters in Maplibre
    maplibreMap.jumpTo({
      center: toLonLat(viewState.center) as [number, number],
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-viewState.rotation),
    });

    const opacity = layer.getOpacity().toString();
    if (maplibreCanvas && opacity !== maplibreCanvas.style.opacity) {
      maplibreCanvas.style.opacity = opacity;
    }

    if (!maplibreCanvas.isConnected) {
      // The canvas is not connected to the DOM, request a map rendering at the next animation frame
      // to set the canvas size.
      map.render();
    } else if (!sameSize(maplibreCanvas, frameState)) {
      maplibreMap.resize();
    }

    maplibreMap.redraw();

    return maplibreMap.getContainer();
  }

  override getFeatures(pixel: Pixel) {
    const coordinate = this.getLayer()
      .getMapInternal()
      ?.getCoordinateFromPixel(pixel);
    return Promise.resolve(this.getFeaturesAtCoordinate(coordinate));
  }

  override forEachFeatureAtCoordinate<Feature>(
    coordinate: Coordinate,
    frameState: FrameState,
    hitTolerance: number,
    callback: FeatureCallback<Feature>,
  ): Feature | undefined {
    const features = this.getFeaturesAtCoordinate(coordinate, hitTolerance);
    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry instanceof SimpleGeometry) {
        callback(feature, this.layer_, geometry);
      }
    });
    return features?.[0] as Feature;
  }

  private getMaplibrePixels(
    coordinate?: Coordinate,
    hitTolerance?: number,
  ): [[number, number], [number, number]] | [number, number] | undefined {
    if (!coordinate) {
      return;
    }

    const pixel = this.getLayer().maplibreMap?.project(
      toLonLat(coordinate) as [number, number],
    );

    if (pixel?.x === undefined || pixel?.y === undefined) {
      return;
    }

    let pixels: [[number, number], [number, number]] | [number, number] = [
      pixel.x,
      pixel.y,
    ];

    if (hitTolerance) {
      const [x, y] = pixels as [number, number];
      pixels = [
        [x - hitTolerance, y - hitTolerance],
        [x + hitTolerance, y + hitTolerance],
      ];
    }
    return pixels;
  }

  private toOlFeature(feature: MapGeoJSONFeature) {
    const layer = this.getLayer();
    const map = layer.getMapInternal();

    const projection =
      map?.getView()?.getProjection()?.getCode() || 'EPSG:3857';

    if (!formats[projection]) {
      formats[projection] = new GeoJSON({
        featureProjection: projection,
      });
    }

    const olFeature = formats[projection].readFeature(feature) as Feature;
    if (olFeature) {
      // We save the original Maplibre feature to avoid losing informations
      // potentially needed for other functionnality like highlighting
      // (id, layer id, source, sourceLayer ...)
      olFeature.set(VECTOR_TILE_FEATURE_PROPERTY, feature, true);
    }
    return olFeature;
  }
}

function sameSize(canvas: HTMLCanvasElement, frameState: FrameState): boolean {
  return (
    canvas.width === Math.floor(frameState.size[0] * frameState.pixelRatio) &&
    canvas.height === Math.floor(frameState.size[1] * frameState.pixelRatio)
  );
}
