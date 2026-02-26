import type {Source, Style} from 'maplibre-gl';
import type {Map as MapLibreMap} from 'maplibre-gl';

/**
 * Return the copyright a MapLibre map.
 * @param map A MapLibre map
 */
const getMapLibreAttributions = (map: MapLibreMap | undefined): string[] => {
  if (!map) {
    return [];
  }
  const {style} = map;
  if (!style) {
    return [];
  }
  // @ts-expect-error -  sourceCaches exists in maplibre-gl < 5.11.0 and tileManagers in maplibre-gl >= 5.11.0
  const {sourceCaches, tileManagers} = style;
  let copyrights: string[] = [];
  const caches: Record<string, {used: boolean; getSource: () => Source}> = tileManagers || sourceCaches || {};
  Object.values(caches).forEach(
    (value: {used: boolean; getSource: () => Source}) => {
      if (value.used) {
        const {attribution} = value.getSource();

        if (attribution) {
          copyrights = copyrights.concat(
            attribution.replace(/&copy;/g, '©').split(/(<a.*?<\/a>)/),
          );
        }
      }
    }
  );

  return removeDuplicate(copyrights);
};
/**
 * This function remove duplicates lower case string value of an array.
 * It removes also null, undefined or non string values.
 *
 * @param {array} array Array of values.
 */
export const removeDuplicate = (array: string[]): string[] => {
  const arrWithoutEmptyValues = array.filter(
    (val) => val !== undefined && val !== null && val.trim && val.trim()
  );
  const lowerCasesValues = arrWithoutEmptyValues.map((str) =>
    str.toLowerCase(),
  );
  // Use of Set removes duplicates
  const uniqueLowerCaseValues = [...new Set(lowerCasesValues)] as string[];
  return uniqueLowerCaseValues.map((uniqueStr) =>
    arrWithoutEmptyValues.find((str) => str.toLowerCase() === uniqueStr),
  ) as string[];
};

export default getMapLibreAttributions;
