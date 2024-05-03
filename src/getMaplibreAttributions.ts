import {Source} from 'maplibre-gl';

/**
 * Return the copyright a Maplibre map.
 * @param {maplibregl.Map} map A Maplibre map
 */
const getMaplibreAttributions = (map: maplibregl.Map | undefined) => {
  if (!map) {
    return [];
  }
  const {style} = map;
  if (!style) {
    return [];
  }
  const {sourceCaches} = style;
  let copyrights: string[] = [];

  Object.values(sourceCaches).forEach(
    (value: {used: boolean; getSource: () => Source}) => {
      if (value.used) {
        const source = value.getSource();

        const attribution = source.attribution;

        if (attribution) {
          copyrights = copyrights.concat(
            attribution.replace(/&copy;/g, '©').split(/(<a.*?<\/a>)/),
          );
        }
      }
    },
  );

  return removeDuplicate(copyrights);
};
/**
 * This function remove duplicates lower case string value of an array.
 * It removes also null, undefined or non string values.
 *
 * @param {array} array Array of values.
 */
const removeDuplicate = (array: string[]): string[] => {
  const arrWithoutEmptyValues = array.filter(
    (val) => val !== undefined && val !== null && val.trim && val.trim(),
  );
  const lowerCasesValues = arrWithoutEmptyValues.map((str) =>
    str.toLowerCase(),
  );
  const uniqueLowerCaseValues = [...new Set(lowerCasesValues)] as string[];
  const uniqueValues = uniqueLowerCaseValues.map((uniqueStr) =>
    arrWithoutEmptyValues.find((str) => str.toLowerCase() === uniqueStr),
  ) as string[];
  return uniqueValues;
};

export default getMaplibreAttributions;
