import removeDuplicate from './removeDuplicate';

/**
 * Return the copyright a Maplibre map.
 * @param {maplibregl.Map} map A Maplibre map
 * @private
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

  Object.values(sourceCaches).forEach((value) => {
    if (value.used as boolean) {
      const source = value.getSource();

      const attribution =
        source.attribution || (source.options && source.options.attribution);

      if (attribution) {
        copyrights = copyrights.concat(
          attribution.replace(/&copy;/g, '©').split(/(<a.*?<\/a>)/),
        );
      }
    }
  });

  return removeDuplicate(copyrights);
};
/**
 * This function remove duplicates lower case string value of an array.
 * It removes also null, undefined or non string values.
 *
 * @param {array} array Array of values.
 * @private
 */
const removeDuplicate = (array: any[]) => {
  const arrWithoutEmptyValues = array.filter(
    (val) => val !== undefined && val !== null && val.trim && val.trim(),
  );
  const lowerCasesValues = arrWithoutEmptyValues.map((str) =>
    str.toLowerCase(),
  );
  const uniqueLowerCaseValues = [...new Set(lowerCasesValues)];
  const uniqueValues = uniqueLowerCaseValues.map((uniqueStr) =>
    arrWithoutEmptyValues.find((str) => str.toLowerCase() === uniqueStr),
  );
  return uniqueValues;
};

export default getMaplibreAttributions;
